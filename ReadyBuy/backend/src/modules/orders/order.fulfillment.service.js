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


export const fulfillOrder =
    async (orderId, userId) => {

        /*
         * Load order.
         */
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


        /*
         * Ensure this order belongs
         * to the requesting user.
         */
        if (
            order.user._id
                ?.toString() !==
            userId.toString()
        ) {

            throw new AppError(
                "Unauthorized",
                403
            );
        }


        /*
         * Only confirmed orders
         * can be fulfilled.
         */
        if (
            order.status !==
            "CONFIRMED"
        ) {

            throw new AppError(
                "Order is not ready for fulfillment",
                409
            );
        }


        /*
         * Atomically claim inventory
         * event publication.
         */
        const claim =
            await claimInventoryPublish(
                order._id
            );


        if (claim) {

            /*
             * Only this request publishes
             * the inventory event.
             */
            await publishOrderCreated(
                order
            );
        }


        /*
         * Cart clearing is naturally
         * idempotent.
         */
        const cart =
            await findCartByUserId(
                userId
            );


        if (
            cart &&
            cart.items.length > 0
        ) {

            cart.items = [];

            await saveCart(
                cart
            );
        }


        return {
            order,

            inventoryPublished:
                Boolean(claim),
        };
    };