import api from "./api";

export const getWishlist = async () => {
    const { data } = await api.get("/wishlist");
    return data.data;
};

export const addToWishlist = async (productId) => {
    const { data } = await api.post("/wishlist", {
        product: productId,
    });
    return data.data;
};

export const removeFromWishlist = async (productId) => {
    const { data } = await api.delete(
        `/wishlist/${productId}`
    );
    return data.data;
};

export const toggleWishlist = async (productId) => {
    const { data } = await api.post(
        `/wishlist/toggle/${productId}`
    );
    return data.data;
};