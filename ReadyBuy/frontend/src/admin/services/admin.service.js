import api from "../../services/api";

export const getDashboardStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data.data;
};

export const getMonthlyRevenue = async () => {
    const response = await api.get("/admin/revenue");
    return response.data.data;
};

export const getTopProducts = async () => {
    const { data } = await api.get(
        "/admin/top-products"
    );

    return data.data;
};

export const getTopCategories = async () => {
    const { data } = await api.get(
        "/admin/top-categories"
    );

    return data.data;
};

export const getRecentOrders = async () => {

    const { data } =
        await api.get(
            "/admin/recent-orders"
        );

    return data.data;

};

export const getLowStockProducts = async () => {

    const { data } =
        await api.get(
            "/admin/low-stock"
        );

    return data.data;

};