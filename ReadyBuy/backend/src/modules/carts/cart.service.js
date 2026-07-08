import AppError from "../../shared/errors/AppError.js";

import {
    findCartByUserId,
    createCart,
    saveCart,
} from "./cart.repository.js";

import {
    findProductById,
} from "../products/product.repository.js";

/**
 * Add to Cart
 */
export const addToCartService = async (
    userId,
    productId,
    size,
    quantity
) => {

    const product = await findProductById(productId);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    if (quantity > product.stock) {
        throw new AppError("Insufficient stock", 400);
    }

    let cart = await findCartByUserId(userId);

    if (!cart) {
        cart = await createCart({
            user: userId,
            items: [],
        });
    }

    const existingItem = cart.items.find(
        (item) =>
            item.product._id.toString() === productId &&
            item.size === size
    );

    if (
        existingItem &&
        existingItem.quantity + quantity > product.stock
    ) {
        throw new AppError("Insufficient stock", 400);
    }

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            size,
            quantity,
        });
    }

    await saveCart(cart);

    // Return populated cart
    return await findCartByUserId(userId);
};

/**
 * Get Cart
 */
export const getCartService = async (userId) => {

    const cart = await findCartByUserId(userId);

    if (!cart) {
        return {
            cart: {
                items: [],
            },
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

/**
 * Update Cart Item
 */
export const updateCartItemService = async (
    userId,
    productId,
    size,
    quantity
) => {

    const cart = await findCartByUserId(userId);

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    const item = cart.items.find(
        (item) =>
            item.product._id.toString() === productId &&
            item.size === size
    );

    if (!item) {
        throw new AppError("Item not found in cart", 404);
    }

    item.quantity = quantity;

    await saveCart(cart);

    return await findCartByUserId(userId);
};

/**
 * Remove Cart Item
 */
export const removeFromCartService = async (
    userId,
    productId,
    size
) => {

    const cart = await findCartByUserId(userId);

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    cart.items = cart.items.filter(
        (item) =>
            !(
                item.product._id.toString() === productId &&
                item.size === size
            )
    );

    await saveCart(cart);

    return await findCartByUserId(userId);
};