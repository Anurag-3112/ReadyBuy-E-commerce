import api from "./api";

export const checkout = async (checkoutData) => {

    const response = await api.post(
        "/orders",
        checkoutData
    );

    return response.data.data;

};