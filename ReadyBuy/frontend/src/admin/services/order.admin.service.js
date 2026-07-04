import api from "../../services/api";

export const getOrders = async (params = {}) => {
    const response = await api.get(
        "/admin/orders",
        {
            params,
        }
    );

    return response.data.data;
};

export const getOrder = async (id) => {
    const response = await api.get(
        `/admin/orders/${id}`
    );

    return response.data.data;
};

export const updateOrderStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/admin/orders/${id}/status`,
        {
            status,
        }
    );

    return response.data.data;
};

export const deleteOrder = async (id) => {
    const response = await api.delete(
        `/admin/orders/${id}`
    );

    return response.data.data;
};

export const getOrderStats = async () => {
    const response = await api.get(
        "/admin/orders/stats"
    );

    return response.data.data;
};

export const getRecentOrders = async () => {
    const response = await api.get(
        "/admin/orders/recent"
    );

    return response.data.data;
};