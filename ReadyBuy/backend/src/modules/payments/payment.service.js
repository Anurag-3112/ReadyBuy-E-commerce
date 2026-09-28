import crypto from "crypto";
import Razorpay from "razorpay";
import AppError from "../../shared/errors/AppError.js";
import config from "../../config/env.js";
import { fulfillOrder } from "../orders/order.fulfillment.service.js";
import {
    confirmPendingOrder,
    findOrderById,
} from "../orders/order.repository.js";
import {
    createPayment,
    findPaymentByOrderId,
    findPaymentByGatewayOrderId,
    markPaymentAsPaid,
    updatePayment,
} from "./payment.repository.js";
import {
    findEventById,
    createEvent,
    markEventProcessed,
    markEventFailed,
} from "./payment-event.repository.js";
import { consumeCouponService } from "../coupons/coupon.service.js";

let razorpayClient = null;

const getRazorpayClient = () => {
    if (
        !config.razorpay.keyId ||
        !config.razorpay.keySecret
    ) {
        throw new AppError(
            "Razorpay is not configured",
            500
        );
    }

    if (!razorpayClient) {
        razorpayClient = new Razorpay({
            key_id: config.razorpay.keyId,
            key_secret: config.razorpay.keySecret,
        });
    }

    return razorpayClient;
};

export const createRazorpayOrder = async ({
    orderId,
    amount,
    currency = "INR",
}) => {
    const razorpay = getRazorpayClient();
    const amountInPaise = Math.round(amount * 100);

    if (amountInPaise <= 0) {
        throw new AppError(
            "Invalid payment amount",
            400
        );
    }

    return razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: `readybuy_${orderId}`,
    });
};

export const createPaymentRecord = async ({
    order,
    user,
    amount,
    currency = "INR",
    method,
    gateway,
    status,
    gatewayOrderId,
}) => {
    return createPayment({
        order,
        user,
        amount,
        currency,
        method,
        gateway,
        status,
        gatewayOrderId,
    });
};

export const getPaymentByOrderId = async (orderId) => {
    return findPaymentByOrderId(orderId);
};

const verifyRazorpaySignature = ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
}) => {
    if (
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature
    ) {
        throw new AppError(
            "Incomplete Razorpay payment data",
            400
        );
    }

    if (!config.razorpay.keySecret) {
        throw new AppError(
            "Razorpay is not configured",
            500
        );
    }

    const body =
        `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            config.razorpay.keySecret
        )
        .update(body)
        .digest("hex");

    const expectedBuffer = Buffer.from(
        expectedSignature,
        "utf8"
    );

    const receivedBuffer = Buffer.from(
        razorpaySignature,
        "utf8"
    );

    if (
        expectedBuffer.length !==
        receivedBuffer.length
    ) {
        throw new AppError(
            "Invalid Razorpay payment signature",
            400
        );
    }

    const isValid = crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
    );

    if (!isValid) {
        throw new AppError(
            "Invalid Razorpay payment signature",
            400
        );
    }

    return true;
};

export const verifyWebhookSignature = ({
    rawBody,
    signature,
}) => {
    if (!rawBody || !signature) {
        throw new AppError(
            "Invalid webhook request",
            400
        );
    }

    if (!config.razorpay.webhookSecret) {
        throw new AppError(
            "Razorpay webhook secret is not configured",
            500
        );
    }

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            config.razorpay.webhookSecret
        )
        .update(rawBody)
        .digest("hex");

    const expectedBuffer = Buffer.from(
        expectedSignature,
        "utf8"
    );

    const receivedBuffer = Buffer.from(
        signature,
        "utf8"
    );

    if (
        expectedBuffer.length !==
        receivedBuffer.length
    ) {
        throw new AppError(
            "Invalid Razorpay webhook signature",
            400
        );
    }

    const valid = crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
    );

    if (!valid) {
        throw new AppError(
            "Invalid Razorpay webhook signature",
            400
        );
    }

    return true;
};

export const finalizeSuccessfulPayment = async ({
    payment,
    razorpayPaymentId,
    razorpaySignature,
}) => {
    let currentPayment = payment;
    let paymentWasJustPaid = false;

    if (currentPayment.status !== "PAID") {
        const updatedPayment = await markPaymentAsPaid(
            currentPayment._id,
            {
                gatewayPaymentId:
                    razorpayPaymentId ||
                    currentPayment.gatewayPaymentId,
                gatewaySignature:
                    razorpaySignature ||
                    currentPayment.gatewaySignature,
            }
        );

        if (updatedPayment) {
            currentPayment = updatedPayment;
            paymentWasJustPaid = true;
        } else {
            currentPayment =
                await findPaymentByOrderId(
                    currentPayment.order
                );
        }
    }

    if (
        !currentPayment ||
        currentPayment.status !== "PAID"
    ) {
        throw new AppError(
            "Payment could not be confirmed",
            409
        );
    }

    const order =
        await findOrderById(
            currentPayment.order
        );

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    if (
        paymentWasJustPaid &&
        order.coupon
    ) {
        await consumeCouponService(
            order.coupon
        );
    }

    const confirmedOrder =
        await confirmPendingOrder(
            currentPayment.order
        );

    if (!confirmedOrder) {
        if (order.status !== "CONFIRMED") {
            throw new AppError(
                `Order cannot be fulfilled from status ${order.status}`,
                409
            );
        }
    }

    const fulfillment = await fulfillOrder(
        currentPayment.order,
        currentPayment.user
    );

    return {
        payment: currentPayment,
        order: fulfillment.order,
        alreadyProcessed:
            !fulfillment.inventoryPublished,
    };
};

export const verifyRazorpayPayment = async ({
    orderId,
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
}) => {
    const payment =
        await findPaymentByOrderId(orderId);

    if (!payment) {
        throw new AppError(
            "Payment not found",
            404
        );
    }

    if (
        payment.user.toString() !==
        userId.toString()
    ) {
        throw new AppError(
            "Unauthorized payment verification",
            403
        );
    }

    if (
        payment.method !== "RAZORPAY" ||
        payment.gateway !== "RAZORPAY"
    ) {
        throw new AppError(
            "Invalid payment gateway",
            400
        );
    }

    if (payment.status !== "PAID") {
        if (
            payment.gatewayOrderId !==
            razorpayOrderId
        ) {
            throw new AppError(
                "Razorpay order mismatch",
                400
            );
        }

        verifyRazorpaySignature({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });
    }

    const result =
        await finalizeSuccessfulPayment({
            payment,
            razorpayPaymentId,
            razorpaySignature,
        });

    return {
        payment: result.payment,
        order: result.order,
        alreadyPaid:
            payment.status === "PAID",
        alreadyProcessed:
            result.alreadyProcessed,
    };
};

export const processWebhook = async ({
    eventId,
    event,
    payload,
}) => {
    const existingEvent =
        await findEventById(eventId);

    if (existingEvent) {
        return {
            duplicate: true,
            processed: existingEvent.processed,
        };
    }

    await createEvent({
        eventId,
        event,
        processed: false,
    });

    try {
        if (event === "payment.captured") {
            const paymentEntity =
                payload?.payload?.payment?.entity;

            if (!paymentEntity) {
                throw new AppError(
                    "Invalid payment.captured payload",
                    400
                );
            }

            const gatewayOrderId =
                paymentEntity.order_id;

            const payment =
                await findPaymentByGatewayOrderId(
                    gatewayOrderId
                );

            if (!payment) {
                throw new AppError(
                    "Payment record not found",
                    404
                );
            }

            const webhookAmount = Number(
                paymentEntity.amount
            );

            const expectedAmount = Math.round(
                payment.amount * 100
            );

            if (
                webhookAmount !==
                expectedAmount
            ) {
                throw new AppError(
                    "Webhook payment amount mismatch",
                    400
                );
            }

            if (
                paymentEntity.currency !==
                payment.currency
            ) {
                throw new AppError(
                    "Webhook payment currency mismatch",
                    400
                );
            }

            await finalizeSuccessfulPayment({
                payment,
                razorpayPaymentId:
                    paymentEntity.id,
            });
        }

        if (event === "payment.failed") {
            const paymentEntity =
                payload?.payload?.payment?.entity;

            if (!paymentEntity) {
                throw new AppError(
                    "Invalid payment.failed payload",
                    400
                );
            }

            const payment =
                await findPaymentByGatewayOrderId(
                    paymentEntity.order_id
                );

            if (
                payment &&
                payment.status !== "PAID"
            ) {
                await updatePayment(
                    payment._id,
                    {
                        status: "FAILED",
                        gatewayPaymentId:
                            paymentEntity.id,
                        failureReason:
                            paymentEntity
                                ?.error_description ||
                            paymentEntity
                                ?.error_reason ||
                            "Payment failed",
                    }
                );
            }
        }

        if (event === "order.paid") {
            const orderEntity =
                payload?.payload?.order?.entity;

            if (!orderEntity) {
                throw new AppError(
                    "Invalid order.paid payload",
                    400
                );
            }

            const gatewayOrderId =
                orderEntity.id;

            const payment =
                await findPaymentByGatewayOrderId(
                    gatewayOrderId
                );

            if (!payment) {
                throw new AppError(
                    "Payment record not found",
                    404
                );
            }

            if (
                orderEntity.amount_paid !==
                undefined
            ) {
                const webhookAmount = Number(
                    orderEntity.amount_paid
                );

                const expectedAmount = Math.round(
                    payment.amount * 100
                );

                if (
                    webhookAmount !==
                    expectedAmount
                ) {
                    throw new AppError(
                        "Webhook order amount mismatch",
                        400
                    );
                }
            }

            await finalizeSuccessfulPayment({
                payment,
            });
        }

        await markEventProcessed(eventId);

        return {
            duplicate: false,
            processed: true,
        };
    } catch (error) {
        await markEventFailed(
            eventId,
            error
        );

        throw error;
    }
};