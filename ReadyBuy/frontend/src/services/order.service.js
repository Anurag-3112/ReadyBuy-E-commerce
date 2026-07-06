import api from "./api";

export const createOrder = async (checkoutData) => {
    const res = await api.post("/orders", checkoutData);
    return res.data.data;
};

export const getOrders = async () => {
    const res = await api.get("/orders/my-orders");
    return res.data.data;
};

export const getOrder = async (id) => {
    const res = await api.get(`/orders/my-orders/${id}`);
    return res.data.data;
};