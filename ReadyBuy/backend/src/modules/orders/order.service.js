import AppError from "../../shared/errors/AppError.js";

import {
    findCartByUserId,
    saveCart,
} from "../carts/cart.repository.js";

import { publishOrderCreated }
    from "../../events/publishers/order.publisher.js";

import {
    createOrder,
    findOrdersByUser,
    findOrderById,
    findAllOrders,
    updateOrderStatus,
    deleteOrder,
    countOrders,
    countOrdersByStatus,
    recentOrders,
} from "./order.repository.js";


const ORDER_STATUSES = [
    "PENDING",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export const getOrdersService =
    async (userId) => {

        return findOrdersByUser(
            userId
        );
    };

export const getOrderByIdService = async (
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

    if (order.user._id.toString() !== userId) {
        throw new AppError("Unauthorized", 403);
    }

    return order;
};

export const createOrderService =
    async (userId,
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


        if (
            !cart ||
            cart.items.length === 0
        ) {
            throw new AppError(
                "Cart is empty",
                400
            );
        }

        let totalAmount = 0;

        const orderItems =
            cart.items.map((item) => {
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

                totalAmount +=
                    item.product.price.discounted *
                    item.quantity;

                return {
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price.discounted,
                    quantity: item.quantity,
                };
            });
        for (
            const item of cart.items
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
        const order =
            await createOrder({

                user: userId,

                items: orderItems,

                totalAmount,

                shippingAddress,

                paymentMethod,

                paymentStatus:
                    paymentMethod === "COD"
                        ? "PENDING"
                        : "PENDING",

            });

        await publishOrderCreated(
            order
        );

        cart.items = [];

        await saveCart(cart);

        return order;
    };

export const getAllOrdersService = async ({
    page = 1,
    limit = 10,
    status,
    search,
}) => {

    return findAllOrders({
        page,
        limit,
        status,
        search,
    });

};

export const getAdminOrderService =
    async (orderId) => {

        const order =
            await findOrderById(orderId);

        if (!order) {

            throw new AppError(
                "Order not found",
                404
            );

        }

        return order;

    };

export const updateOrderStatusService =
    async (
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
                "Delivered orders cannot be modified",
                400
            );

        }

        return updateOrderStatus(
            orderId,
            status
        );

    };

export const deleteOrderService =
    async (orderId) => {

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

export const getOrderStatsService =
    async () => {

        return {

            total:
                await countOrders(),

            pending:
                await countOrdersByStatus(
                    "PENDING"
                ),

            paid:
                await countOrdersByStatus(
                    "PAID"
                ),

            shipped:
                await countOrdersByStatus(
                    "SHIPPED"
                ),

            delivered:
                await countOrdersByStatus(
                    "DELIVERED"
                ),

            cancelled:
                await countOrdersByStatus(
                    "CANCELLED"
                ),

        };

    };

export const getRecentOrdersService =
    async () => {

        return recentOrders(5);

    };