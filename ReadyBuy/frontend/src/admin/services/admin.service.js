import api from "../../services/api";

export const getDashboardStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data.data;
};

export const getMonthlyRevenue = async () => {
    const response = await api.get("/admin/revenue");
    return response.data.data;
};