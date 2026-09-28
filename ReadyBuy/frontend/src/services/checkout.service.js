import api from "./api";

export const checkout = async (checkoutData) => {
    const response = await api.post(
        "/orders",
        checkoutData
    );

    console.log(
        "========== RAW AXIOS RESPONSE =========="
    );

    console.log(
        "response:",
        response
    );

    console.log(
        "response.data:",
        response.data
    );

    console.log(
        "response.data.data:",
        response.data?.data
    );

    console.log(
        "data has order:",
        Boolean(response.data?.data?.order)
    );

    console.log(
        "data has payment:",
        Boolean(response.data?.data?.payment)
    );

    console.log(
        "========================================"
    );

    return response.data.data;
};