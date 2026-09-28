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

import {
    fulfillOrder,
} from "./order.fulfillment.service.js";


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


/*
 * Create order
 */
const createOrderService =
    async (
        userId,
        checkoutData = {}
    ) => {

        const cart =
            await findCartByUserId(
                userId
            );


        const {
            shippingAddress,
            paymentMethod,
        } = checkoutData;


        /*
         * Validate cart.
         */
        if (
            !cart ||
            cart.items.length === 0
        ) {

            throw new AppError(
                "Cart is empty",
                400
            );
        }


        /*
         * Validate payment method.
         */
        if (
            !PAYMENT_METHODS.includes(
                paymentMethod
            )
        ) {

            throw new AppError(
                "Invalid payment method",
                400
            );
        }


        /*
         * Validate shipping address.
         */
        const requiredAddressFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "pincode",
            "country",
        ];


        for (
            const field of
            requiredAddressFields
        ) {

            if (
                !shippingAddress?.[
                    field
                ]?.trim()
            ) {

                throw new AppError(
                    `${field} is required`,
                    400
                );
            }
        }


        /*
         * Calculate total using
         * backend product data.
         */
        let totalAmount = 0;


        const orderItems =
            cart.items.map(
                (item) => {

                    if (
                        !item.product
                    ) {

                        throw new AppError(
                            "Product missing from cart",
                            400
                        );
                    }


                    if (
                        !item.product.price
                    ) {

                        throw new AppError(
                            "Invalid product",
                            400
                        );
                    }


                    if (
                        item.quantity <= 0
                    ) {

                        throw new AppError(
                            "Invalid quantity",
                            400
                        );
                    }


                    const price =
                        item.product
                            .price
                            .discounted;


                    if (
                        typeof price !==
                        "number"
                    ) {

                        throw new AppError(
                            "Invalid product price",
                            400
                        );
                    }


                    totalAmount +=
                        price *
                        item.quantity;


                    return {
                        product:
                            item.product
                                ._id,

                        name:
                            item.product
                                .name,

                        price,

                        quantity:
                            item.quantity,
                    };
                }
            );


        /*
         * Validate stock.
         */
        for (
            const item of
            cart.items
        ) {

            if (
                item.quantity >
                item.product.stock
            ) {

                throw new AppError(
                    `${item.product.name} is out of stock`,
                    400
                );
            }
        }


        /*
         * Normalize total.
         */
        totalAmount =
            Number(
                totalAmount.toFixed(2)
            );


        /*
         * COD can immediately become
         * CONFIRMED.
         *
         * Razorpay remains PENDING
         * until payment succeeds.
         */
        const order =
            await createOrder({

                user:
                    userId,

                items:
                    orderItems,

                totalAmount,

                shippingAddress,

                paymentMethod,

                status:
                    paymentMethod ===
                        "COD"
                        ? "CONFIRMED"
                        : "PENDING",
            });


        /*
         * ------------------------------------------------
         * COD
         * ------------------------------------------------
         */
        if (
            paymentMethod ===
            "COD"
        ) {

            const payment =
                await createPaymentRecord({
                    order:
                        order._id,

                    user:
                        userId,

                    amount:
                        totalAmount,

                    currency:
                        "INR",

                    method:
                        "COD",

                    gateway:
                        "NONE",

                    status:
                        "PENDING",
                });


            /*
             * Use the same fulfillment
             * path used by successful
             * Razorpay payments.
             */
            const fulfillment =
                await fulfillOrder(
                    order._id,
                    userId
                );


            return {
                order:
                    fulfillment.order,

                payment,

                alreadyProcessed:
                    !fulfillment
                        .inventoryPublished,
            };
        }


        /*
         * ------------------------------------------------
         * RAZORPAY
         * ------------------------------------------------
         */

        try {

            const razorpayOrder =
                await createRazorpayOrder({
                    orderId:
                        order._id.toString(),

                    amount:
                        totalAmount,

                    currency:
                        "INR",
                });


            /*
             * Create local payment record.
             */
            const payment =
                await createPaymentRecord({
                    order:
                        order._id,

                    user:
                        userId,

                    amount:
                        totalAmount,

                    currency:
                        "INR",

                    method:
                        "RAZORPAY",

                    gateway:
                        "RAZORPAY",

                    status:
                        "CREATED",

                    gatewayOrderId:
                        razorpayOrder.id,
                });


            /*
             * Do NOT fulfill yet.
             *
             * Payment hasn't succeeded.
             */
            return {
                order,

                payment: {
                    id:
                        payment._id,

                    method:
                        payment.method,

                    status:
                        payment.status,

                    gateway:
                        payment.gateway,

                    gatewayOrderId:
                        payment.gatewayOrderId,

                    amount:
                        payment.amount,

                    currency:
                        payment.currency,

                    keyId:
                        config
                            .razorpay
                            .keyId,
                },
            };

        } catch (error) {

            /*
             * Razorpay order/payment setup failed.
             *
             * Do not leave the local order
             * in a usable PENDING state.
             */
            await updateOrderStatus(
                order._id,
                "CANCELLED"
            );

            throw error;
        }
    };


/*
 * Get user's orders
 */
const getUserOrdersService = async (
    userId,
    query
) => {

    return findOrdersByUser(
        userId,
        query
    );
};


/*
 * Get one order by ID
 */
const getOrderByIdService = async (
    orderId,
    userId
) => {

    const order =
        await findOrderById(
            orderId
        );


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

/*
 * Get one order by ID for admin
 */
const getAdminOrderService = async (
    orderId
) => {

    const order =
        await findOrderById(
            orderId
        );

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    return order;
};

/*
 * Get all orders
 */
const getAllOrdersService = async (
    query
) => {

    return findAllOrders(
        query
    );
};


/*
 * Get order statistics
 */
const getOrderStatsService = async () => {

    return getOrderStats();
};


/*
 * Get recent orders
 */
const getRecentOrdersService = async (
    limit = 10
) => {

    return getRecentOrders(
        limit
    );
};


/*
 * Update order status
 */
const updateOrderStatusService = async (
    orderId,
    status
) => {

    if (
        !ORDER_STATUSES.includes(
            status
        )
    ) {

        throw new AppError(
            "Invalid order status",
            400
        );
    }


    const order =
        await findOrderById(
            orderId
        );


    if (!order) {

        throw new AppError(
            "Order not found",
            404
        );
    }


    if (
        order.status ===
        "DELIVERED"
    ) {

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


/*
 * Delete order
 */
const deleteOrderService = async (
    orderId
) => {

    const order =
        await findOrderById(
            orderId
        );


    if (!order) {

        throw new AppError(
            "Order not found",
            404
        );
    }


    return deleteOrder(
        orderId
    );
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