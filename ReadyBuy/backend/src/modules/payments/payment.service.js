import crypto from "crypto";

import Razorpay from "razorpay";

import AppError from "../../shared/errors/AppError.js";

import config from "../../config/env.js";

import {
    fulfillOrder,
} from "../orders/order.fulfillment.service.js";

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


let razorpayClient = null;


/*
 * ------------------------------------------------
 * Razorpay client
 * ------------------------------------------------
 */

/*
 * Create/reuse Razorpay client.
 */
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

        razorpayClient =
            new Razorpay({
                key_id:
                    config.razorpay.keyId,

                key_secret:
                    config.razorpay.keySecret,
            });
    }


    return razorpayClient;
};


/*
 * ------------------------------------------------
 * Create Razorpay order
 * ------------------------------------------------
 */

/*
 * Create Razorpay order.
 *
 * Razorpay expects amount in paise.
 *
 * Example:
 *
 * ₹499.99
 *
 * becomes:
 *
 * 49999 paise
 */
export const createRazorpayOrder =
    async ({
        orderId,
        amount,
        currency = "INR",
    }) => {

        const razorpay =
            getRazorpayClient();


        const amountInPaise =
            Math.round(
                amount * 100
            );


        if (
            amountInPaise <= 0
        ) {

            throw new AppError(
                "Invalid payment amount",
                400
            );
        }


        return razorpay.orders.create({
            amount:
                amountInPaise,

            currency,

            receipt:
                `readybuy_${orderId}`,
        });
    };


/*
 * ------------------------------------------------
 * Local payment record
 * ------------------------------------------------
 */

/*
 * Create our local Payment document.
 */
export const createPaymentRecord =
    async ({
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


/*
 * ------------------------------------------------
 * Payment lookup
 * ------------------------------------------------
 */

/*
 * Get payment belonging to an order.
 */
export const getPaymentByOrderId =
    async (orderId) => {

        return findPaymentByOrderId(
            orderId
        );
    };


/*
 * ------------------------------------------------
 * Razorpay signature verification
 * ------------------------------------------------
 */

/*
 * Verify Razorpay payment signature.
 *
 * Razorpay signs:
 *
 * razorpay_order_id + "|" +
 * razorpay_payment_id
 *
 * using the Razorpay key secret.
 */
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


    if (
        !config
            .razorpay
            .keySecret
    ) {

        throw new AppError(
            "Razorpay is not configured",
            500
        );
    }


    const body =
        `${razorpayOrderId}|${razorpayPaymentId}`;


    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                config
                    .razorpay
                    .keySecret
            )
            .update(
                body
            )
            .digest("hex");


    const expectedBuffer =
        Buffer.from(
            expectedSignature,
            "utf8"
        );


    const receivedBuffer =
        Buffer.from(
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


    const isValid =
        crypto.timingSafeEqual(
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


/*
 * ------------------------------------------------
 * Razorpay webhook signature
 * ------------------------------------------------
 */

/*
 * Verify Razorpay webhook signature.
 *
 * IMPORTANT:
 *
 * rawBody must be the exact request
 * body received from Razorpay.
 *
 * Do NOT JSON.stringify(req.body)
 * and attempt to verify that.
 */
export const verifyWebhookSignature =
    ({
        rawBody,
        signature,
    }) => {

        if (
            !rawBody ||
            !signature
        ) {

            throw new AppError(
                "Invalid webhook request",
                400
            );
        }


        if (
            !config
                .razorpay
                .webhookSecret
        ) {

            throw new AppError(
                "Razorpay webhook secret is not configured",
                500
            );
        }


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    config
                        .razorpay
                        .webhookSecret
                )
                .update(
                    rawBody
                )
                .digest("hex");


        const expectedBuffer =
            Buffer.from(
                expectedSignature,
                "utf8"
            );


        const receivedBuffer =
            Buffer.from(
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


        const valid =
            crypto.timingSafeEqual(
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


/*
 * ------------------------------------------------
 * Finalize successful payment
 * ------------------------------------------------
 */

/*
 * Finalize a successfully paid order.
 *
 * This is the SINGLE payment-success
 * fulfillment path.
 *
 * It is used by:
 *
 * - frontend Razorpay verification
 * - payment.captured webhook
 * - order.paid webhook
 *
 * Responsibilities:
 *
 * 1. Atomically transition payment → PAID
 * 2. Reconcile the order through fulfillOrder()
 * 3. Publish inventory event only once
 * 4. Clear cart through fulfillOrder()
 */
export const finalizeSuccessfulPayment =
    async ({
        payment,
        razorpayPaymentId,
        razorpaySignature,
    }) => {

        /*
         * ------------------------------------------------
         * STEP 1
         * ------------------------------------------------
         *
         * Make sure payment reaches PAID state.
         *
         * markPaymentAsPaid() uses an atomic
         * conditional update:
         *
         * status != PAID
         */
        let currentPayment =
            payment;


        if (
            currentPayment.status !==
            "PAID"
        ) {

            const updatedPayment =
                await markPaymentAsPaid(
                    currentPayment._id,

                    {
                        gatewayPaymentId:
                            razorpayPaymentId ||
                            currentPayment
                                .gatewayPaymentId,

                        gatewaySignature:
                            razorpaySignature ||
                            currentPayment
                                .gatewaySignature,
                    }
                );


            if (updatedPayment) {

                /*
                 * This request won the
                 * atomic PAID transition.
                 */
                currentPayment =
                    updatedPayment;

            } else {

                /*
                 * Another concurrent request
                 * already transitioned the
                 * payment to PAID.
                 *
                 * Reload it and continue
                 * reconciliation.
                 */
                currentPayment =
                    await findPaymentByOrderId(
                        currentPayment.order
                    );
            }
        }


        /*
         * Payment must now be PAID.
         */
        if (
            !currentPayment ||
            currentPayment.status !==
            "PAID"
        ) {

            throw new AppError(
                "Payment could not be confirmed",
                409
            );
        }


        /*
         * ------------------------------------------------
         * STEP 2
         * ------------------------------------------------
         *
         * Single fulfillment path.
         *
         * fulfillOrder() owns:
         *
         * - order confirmation
         * - inventory publication claim
         * - inventory event publication
         * - cart clearing
         */
        const confirmedOrder =
            await confirmPendingOrder(
                currentPayment.order
            );

        if (!confirmedOrder) {
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

            if (order.status !== "CONFIRMED") {
                throw new AppError(
                    `Order cannot be fulfilled from status ${order.status}`,
                    409
                );
            }
        }

        const fulfillment =
            await fulfillOrder(
                currentPayment.order,
                currentPayment.user
            );


        return {
            payment:
                currentPayment,

            order:
                fulfillment.order,

            alreadyProcessed:
                !fulfillment
                    .inventoryPublished,
        };
    };


/*
 * ------------------------------------------------
 * Frontend Razorpay verification
 * ------------------------------------------------
 */

/*
 * Verify Razorpay payment from the
 * frontend and finalize the order.
 */
export const verifyRazorpayPayment =
    async ({
        orderId,
        userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
    }) => {

        /*
         * Find local payment.
         */
        const payment =
            await findPaymentByOrderId(
                orderId
            );


        if (!payment) {

            throw new AppError(
                "Payment not found",
                404
            );
        }


        /*
         * Authorization check.
         */
        if (
            payment.user.toString() !==
            userId.toString()
        ) {

            throw new AppError(
                "Unauthorized payment verification",
                403
            );
        }


        /*
         * Make sure this is a
         * Razorpay payment.
         */
        if (
            payment.method !==
            "RAZORPAY" ||
            payment.gateway !==
            "RAZORPAY"
        ) {

            throw new AppError(
                "Invalid payment gateway",
                400
            );
        }


        /*
         * If payment is not already PAID,
         * validate the frontend Razorpay data.
         */
        if (
            payment.status !==
            "PAID"
        ) {

            /*
             * Razorpay order must match
             * our local payment.
             */
            if (
                payment.gatewayOrderId !==
                razorpayOrderId
            ) {

                throw new AppError(
                    "Razorpay order mismatch",
                    400
                );
            }


            /*
             * Verify Razorpay signature.
             */
            verifyRazorpaySignature({

                razorpayOrderId,

                razorpayPaymentId,

                razorpaySignature,
            });
        }


        /*
         * SINGLE SUCCESSFUL PAYMENT PATH.
         *
         * This handles both:
         *
         * - frontend verification winning
         * - webhook winning
         * - payment already being PAID
         *
         * It also confirms the order BEFORE
         * calling fulfillOrder().
         */
        const result =
            await finalizeSuccessfulPayment({

                payment,

                razorpayPaymentId,

                razorpaySignature,
            });


        return {

            payment:
                result.payment,

            order:
                result.order,

            alreadyPaid:
                payment.status ===
                "PAID",

            alreadyProcessed:
                result.alreadyProcessed,
        };
    };

/*
 * ------------------------------------------------
 * Razorpay webhook processing
 * ------------------------------------------------
 */

/*
 * Process Razorpay webhook.
 */
export const processWebhook =
    async ({
        eventId,
        event,
        payload,
    }) => {

        /*
         * Check whether this event
         * has already been processed.
         */
        const existingEvent =
            await findEventById(
                eventId
            );


        if (
            existingEvent
        ) {

            return {
                duplicate:
                    true,

                processed:
                    existingEvent
                        .processed,
            };
        }


        /*
         * Store event before processing.
         */
        await createEvent({
            eventId,

            event,

            processed:
                false,
        });


        try {

            /*
             * ------------------------------------------------
             * payment.captured
             * ------------------------------------------------
             */
            if (
                event ===
                "payment.captured"
            ) {

                const paymentEntity =
                    payload
                        ?.payload
                        ?.payment
                        ?.entity;


                if (
                    !paymentEntity
                ) {

                    throw new AppError(
                        "Invalid payment.captured payload",
                        400
                    );
                }


                const gatewayOrderId =
                    paymentEntity
                        .order_id;


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


                /*
                 * Validate payment amount.
                 *
                 * Razorpay uses paise.
                 */
                const webhookAmount =
                    Number(
                        paymentEntity
                            .amount
                    );


                const expectedAmount =
                    Math.round(
                        payment.amount *
                        100
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


                /*
                 * Validate currency.
                 */
                if (
                    paymentEntity
                        .currency !==
                    payment.currency
                ) {

                    throw new AppError(
                        "Webhook payment currency mismatch",
                        400
                    );
                }


                /*
                 * Finalize through the
                 * common fulfillment path.
                 */
                await finalizeSuccessfulPayment({
                    payment,

                    razorpayPaymentId:
                        paymentEntity
                            .id,
                });
            }


            /*
             * ------------------------------------------------
             * payment.failed
             * ------------------------------------------------
             */
            if (
                event ===
                "payment.failed"
            ) {

                const paymentEntity =
                    payload
                        ?.payload
                        ?.payment
                        ?.entity;


                if (
                    !paymentEntity
                ) {

                    throw new AppError(
                        "Invalid payment.failed payload",
                        400
                    );
                }


                const payment =
                    await findPaymentByGatewayOrderId(
                        paymentEntity
                            .order_id
                    );


                /*
                 * Only update a known,
                 * non-paid payment.
                 */
                if (
                    payment &&
                    payment.status !==
                    "PAID"
                ) {

                    await updatePayment(
                        payment._id,

                        {
                            status:
                                "FAILED",

                            gatewayPaymentId:
                                paymentEntity
                                    .id,

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


            /*
             * ------------------------------------------------
             * order.paid
             * ------------------------------------------------
             */
            if (
                event ===
                "order.paid"
            ) {

                const orderEntity =
                    payload
                        ?.payload
                        ?.order
                        ?.entity;


                if (
                    !orderEntity
                ) {

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


                /*
                 * Validate amount when
                 * Razorpay provides it.
                 */
                if (
                    orderEntity.amount_paid !==
                    undefined
                ) {

                    const webhookAmount =
                        Number(
                            orderEntity
                                .amount_paid
                        );


                    const expectedAmount =
                        Math.round(
                            payment.amount *
                            100
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


                /*
                 * Finalize through the
                 * common fulfillment path.
                 */
                await finalizeSuccessfulPayment({
                    payment,
                });
            }


            /*
             * ------------------------------------------------
             * Mark event processed
             * ------------------------------------------------
             */
            await markEventProcessed(
                eventId
            );


            return {
                duplicate:
                    false,

                processed:
                    true,
            };

        } catch (error) {

            /*
             * Record webhook failure.
             */
            await markEventFailed(
                eventId,
                error
            );


            throw error;
        }
    };