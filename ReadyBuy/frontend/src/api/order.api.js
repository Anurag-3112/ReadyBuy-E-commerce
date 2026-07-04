import api from "./axios";

export const createOrder =
    () =>
        api.post("/orders");

export const getOrders =
    () =>
        api.get("/orders");