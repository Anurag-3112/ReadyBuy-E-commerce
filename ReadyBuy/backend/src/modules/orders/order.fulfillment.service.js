import AppError from "../../shared/errors/AppError.js";
import {
    findOrderById,
    claimInventoryPublish,
} from "./order.repository.js";
import {
    findCartByUserId,
    saveCart,
} from "../carts/cart.repository.js";
import {
    publishOrderCreated,
} from "../../events/publishers/order.publisher.js";

export const fulfillOrder = async (orderId, userId) => {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    if (
        order.user._id?.toString() !==
        userId.toString()
    ) {
        throw new AppError(
            "Unauthorized",
            403
        );
    }

    if (order.status !== "CONFIRMED") {
        throw new AppError(
            "Order is not ready for fulfillment",
            409
        );
    }

    const claim = await claimInventoryPublish(
        order._id
    );

    if (claim) {
        await publishOrderCreated(order);
    }

    const cart = await findCartByUserId(userId);

    if (
        cart &&
        cart.items.length > 0
    ) {
        cart.items = [];

        await saveCart(cart);
    }

    return {
        order,
        inventoryPublished: Boolean(claim),
    };
};