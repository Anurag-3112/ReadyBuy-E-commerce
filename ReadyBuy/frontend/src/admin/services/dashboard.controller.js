import api from "../../services/api";

export const getDashboardStats = async () => {
    const response = await api.get(
        "/admin/dashboard"
    );

    return response.data.data;
};

export const getRecentOrders = async () => {
    const response = await api.get(
        "/admin/orders/recent"
    );

    return response.data.data;
};

export const getLowStockProducts = async () => {
    const response = await api.get(
        "/admin/products/low-stock"
    );

    return response.data.data;
};

export const getTopProducts = async () => {
    const response = await api.get(
        "/admin/products/top"
    );

    return response.data.data;
};

export const getRecentUsers = async () => {
    const response = await api.get(
        "/admin/users/recent"
    );

    return response.data.data;
};