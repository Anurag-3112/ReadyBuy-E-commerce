import api from "./api";

export const addToCart = async ({
    productId,
    size,
    quantity = 1,
}) => {

    const res = await api.post(
        "/cart",
        {
            productId,
            size,
            quantity,
        }
    );

    return res.data;

};

export const getCart = async () => {
    const res = await api.get("/cart");
    return res.data;
};

export const updateCartQuantity = async (
    productId,
    size,
    quantity
) => {

    const res = await api.patch(
        "/cart/update",
        {
            productId,
            size,
            quantity,
        }
    );

    return res.data;

};

export const removeFromCart = async (
    productId,
    size
) => {

    const res = await api.delete(
        "/cart/remove",
        {
            data: {
                productId,
                size,
            },
        }
    );

    return res.data;

};