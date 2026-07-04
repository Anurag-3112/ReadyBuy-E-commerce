import api from "./axios";

export const getCart =
    () =>
        api.get("/cart");

export const addToCart =
    (payload) =>
        api.post(
            "/cart/add",
            payload
        );

export const updateCart =
    (payload) =>
        api.patch(
            "/cart/update",
            payload
        );

export const removeFromCart =
    (productId) =>
        api.delete(
            `/cart/remove/${productId}`
        );