import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    addToCartService,
    getCartService,
    updateCartItemService,
    removeFromCartService,
} from "./cart.service.js";

export const addToCart =
    asyncHandler(
        async (req, res) => {

            const {
                productId,
                size,
                quantity,
            } = req.body;

            const cart = await addToCartService(
                req.user.userId,
                productId,
                size,
                quantity
            );

            return res.status(200).json({
                success: true,
                message:
                    "Added to cart",
                data: cart,
            });
        }
    );

export const getCart =
    asyncHandler(async (req, res) => {

        const result =
            await getCartService(
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            message:
                "Cart fetched successfully",
            data: result,
        });
    });

export const updateCartItem =
    asyncHandler(async (req, res) => {

        const {
            productId,
            size,
            quantity,
        } = req.body;

        const cart =
            await updateCartItemService(
                req.user.userId,
                productId,
                size,
                quantity
            );

        return res.status(200).json({
            success: true,
            message:
                "Cart updated successfully",
            data: cart,
        });
    });


export const removeFromCart =
    asyncHandler(async (req, res) => {

        const { productId, size } = req.body;

        const cart = await removeFromCartService(
            req.user.userId,
            productId,
            size
        );

        return res.status(200).json({
            success: true,
            message:
                "Item removed from cart",
            data: cart,
        });
    });