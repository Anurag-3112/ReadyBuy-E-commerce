import api from "./api";

export const addToCart = async (productId) => {
    const res = await api.post("/cart/add", {
        productId,
        quantity: 1,
    });

    return res.data;
};

export const getCart = async () => {
    const res = await api.get("/cart");
    return res.data;
};

export const updateCartQuantity = async (
    productId,
    quantity
) => {
    const res = await api.patch("/cart/update", {
        productId,
        quantity,
    });

    return res.data;
};

export const removeFromCart = async (productId) => {
    const res = await api.delete(
        `/cart/remove/${productId}`
    );

    return res.data;
};