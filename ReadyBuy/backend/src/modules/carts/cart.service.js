import AppError from "../../shared/errors/AppError.js";

import {
    findCartByUserId,
    createCart,
    saveCart,
} from "./cart.repository.js";

import {
    findProductById,
} from "../products/product.repository.js";

export const addToCartService = async (
    userId,
    productId,
    quantity
) => {

    const product =
        await findProductById(
            productId
        );

    if (!product) {
        throw new AppError(
            "Product not found",
            404
        );
    }

    if (
        quantity >
        product.stock
    ) {
        throw new AppError(
            "Insufficient stock",
            400
        );
    }

    let cart =
        await findCartByUserId(
            userId
        );

    if (!cart) {
        cart =
            await createCart({
                user: userId,
                items: [],
            });
    }

    const existingItem =
        cart.items.find(
            (item) =>
                item.product._id.toString() ===
                productId
        );

    if (
        existingItem &&
        existingItem.quantity +
        quantity >
        product.stock
    ) {
        throw new AppError(
            "Insufficient stock",
            400
        );
    }

    if (existingItem) {
        existingItem.quantity +=
            quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity,
        });
    }

    await saveCart(cart);

    return cart;
};

export const getCartService = async (
    userId
) => {
    const cart =
        await findCartByUserId(userId);

    if (!cart) {
        return {
            items: [],
            totalItems: 0,
            totalAmount: 0,
        };
    }

    let totalItems = 0;
    let totalAmount = 0;

    cart.items.forEach((item) => {
        totalItems += item.quantity;

        totalAmount +=
            item.product.price.discounted *
            item.quantity;
    });

    return {
        cart,
        totalItems,
        totalAmount,
    };
};

export const updateCartItemService =
    async (
        userId,
        productId,
        quantity
    ) => {

        const cart =
            await findCartByUserId(userId);

        if (!cart) {
            throw new AppError(
                "Cart not found",
                404
            );
        }

        const item =
            cart.items.find(
                (item) =>
                    item.product._id.toString() ===
                    productId
            );

        if (!item) {
            throw new AppError(
                "Item not found in cart",
                404
            );
        }

        item.quantity = quantity;

        await saveCart(cart);

        return cart;
    };

export const removeFromCartService =
    async (
        userId,
        productId
    ) => {

        const cart =
            await findCartByUserId(userId);

        if (!cart) {
            throw new AppError(
                "Cart not found",
                404
            );
        }

        cart.items =
            cart.items.filter(
                (item) =>
                    item.product._id.toString() !==
                    productId
            );

        await saveCart(cart);

        return cart;
    };