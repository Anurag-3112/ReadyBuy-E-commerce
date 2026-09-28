import AppError from "../../shared/errors/AppError.js";
import config from "../../config/env.js";
import { findCartByUserId } from "../carts/cart.repository.js";
import {
    createOrder,
    findOrdersByUser,
    findOrderById,
    findAllOrders,
    getOrderStats,
    getRecentOrders,
    updateOrderStatus,
    deleteOrder,
} from "./order.repository.js";
import {
    createRazorpayOrder,
    createPaymentRecord,
} from "../payments/payment.service.js";
import { fulfillOrder } from "./order.fulfillment.service.js";
import { applyCouponService } from "../coupons/coupon.service.js";
import { consumeCouponService } from "../coupons/coupon.service.js";

const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

const PAYMENT_METHODS = [
    "COD",
    "RAZORPAY",
];

const createOrderService = async (
    userId,
    checkoutData = {}
) => {
    const cart = await findCartByUserId(userId);

    const {
        shippingAddress,
        paymentMethod,
        couponCode,
    } = checkoutData;

    if (
        !cart ||
        cart.items.length === 0
    ) {
        throw new AppError(
            "Cart is empty",
            400
        );
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
        throw new AppError(
            "Invalid payment method",
            400
        );
    }

    const requiredAddressFields = [
        "fullName",
        "phone",
        "addressLine1",
        "city",
        "state",
        "pincode",
        "country",
    ];

    for (const field of requiredAddressFields) {
        if (!shippingAddress?.[field]?.trim()) {
            throw new AppError(
                `${field} is required`,
                400
            );
        }
    }

    let subtotal = 0;

    const orderItems = cart.items.map((item) => {
        if (!item.product) {
            throw new AppError(
                "Product missing from cart",
                400
            );
        }

        if (!item.product.price) {
            throw new AppError(
                "Invalid product",
                400
            );
        }

        if (item.quantity <= 0) {
            throw new AppError(
                "Invalid quantity",
                400
            );
        }

        const price =
            item.product.price.discounted;

        if (typeof price !== "number") {
            throw new AppError(
                "Invalid product price",
                400
            );
        }

        subtotal +=
            price * item.quantity;

        return {
            product: item.product._id,
            name: item.product.name,
            price,
            quantity: item.quantity,
        };
    });

    for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
            throw new AppError(
                `${item.product.name} is out of stock`,
                400
            );
        }
    }

    subtotal = Number(
        subtotal.toFixed(2)
    );

    let discountAmount = 0;
    let coupon = null;
    let finalTotal = subtotal;

    if (couponCode) {
        const couponResult = await applyCouponService({
            code: couponCode,
            orderTotal: subtotal,
        });

        coupon = couponResult.coupon;
        discountAmount = couponResult.discount;
        finalTotal = couponResult.finalTotal;
    }

    finalTotal = Number(
        finalTotal.toFixed(2)
    );

    const order = await createOrder({
        user: userId,
        items: orderItems,
        subtotal,
        coupon: coupon?._id || null,
        couponCode: coupon?.code || "",
        discountAmount,
        totalAmount: finalTotal,
        shippingAddress,
        paymentMethod,
        status:
            paymentMethod === "COD"
                ? "CONFIRMED"
                : "PENDING",
    });

    if (paymentMethod === "COD") {
        const payment = await createPaymentRecord({
            order: order._id,
            user: userId,
            amount: finalTotal,
            currency: "INR",
            method: "COD",
            gateway: "NONE",
            status: "PENDING",
        });

        const fulfillment = await fulfillOrder(
            order._id,
            userId
        );

        return {
            order: fulfillment.order,
            payment,
            alreadyProcessed:
                !fulfillment.inventoryPublished,
        };
    }

    try {
        const razorpayOrder =
            await createRazorpayOrder({
                orderId: order._id.toString(),
                amount: finalTotal,
                currency: "INR",
            });

        const payment = await createPaymentRecord({
            order: order._id,
            user: userId,
            amount: finalTotal,
            currency: "INR",
            method: "RAZORPAY",
            gateway: "RAZORPAY",
            status: "CREATED",
            gatewayOrderId: razorpayOrder.id,
        });

        return {
            order,
            payment: {
                id: payment._id,
                method: payment.method,
                status: payment.status,
                gateway: payment.gateway,
                gatewayOrderId:
                    payment.gatewayOrderId,
                amount: payment.amount,
                currency: payment.currency,
                keyId: config.razorpay.keyId,
            },
        };
    } catch (error) {
        await updateOrderStatus(
            order._id,
            "CANCELLED"
        );

        throw error;
    }
};

const getUserOrdersService = async (
    userId,
    query
) => {
    return findOrdersByUser(
        userId,
        query
    );
};

const getOrderByIdService = async (
    orderId,
    userId
) => {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    if (
        order.user._id.toString() !==
        userId.toString()
    ) {
        throw new AppError(
            "You are not authorized to access this order",
            403
        );
    }

    return order;
};

const getAdminOrderService = async (orderId) => {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    return order;
};

const getAllOrdersService = async (query) => {
    return findAllOrders(query);
};

const getOrderStatsService = async () => {
    return getOrderStats();
};

const getRecentOrdersService = async (limit = 10) => {
    return getRecentOrders(limit);
};

const updateOrderStatusService = async (
    orderId,
    status
) => {
    if (!ORDER_STATUSES.includes(status)) {
        throw new AppError(
            "Invalid order status",
            400
        );
    }

    const order = await findOrderById(orderId);

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    if (order.status === "DELIVERED") {
        throw new AppError(
            "Delivered order cannot be modified",
            400
        );
    }

    return updateOrderStatus(
        orderId,
        status
    );
};

const deleteOrderService = async (orderId) => {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    return deleteOrder(orderId);
};

export {
    createOrderService,
    getUserOrdersService,
    getOrderByIdService,
    getAllOrdersService,
    getOrderStatsService,
    getRecentOrdersService,
    updateOrderStatusService,
    deleteOrderService,
    getAdminOrderService,
};