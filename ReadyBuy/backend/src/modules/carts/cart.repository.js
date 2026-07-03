import Cart from "./cart.model.js";

export const findCartByUserId =
    (userId) =>
        Cart.findOne({
            user: userId,
        }).populate(
            "items.product"
        );

export const createCart =
    (payload) =>
        Cart.create(payload);

export const saveCart =
    (cart) =>
        cart.save();