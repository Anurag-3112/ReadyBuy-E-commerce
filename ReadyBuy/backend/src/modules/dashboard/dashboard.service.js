import {
    getDashboardCounts,
    getRevenue,
    getPendingOrders,
    getLowStockProducts,
    getRecentOrders,
    getRecentUsers,
} from "./dashboard.repository.js";

export const getDashboardService =
    async () => {

        const [
            counts,
            revenue,
            pendingOrders,
            lowStockProducts,
            recentOrders,
            recentUsers,
        ] = await Promise.all([

            getDashboardCounts(),

            getRevenue(),

            getPendingOrders(),

            getLowStockProducts(),

            getRecentOrders(),

            getRecentUsers(),

        ]);

        return {

            ...counts,

            revenue,

            pendingOrders,

            lowStockProducts,

            recentOrders,

            recentUsers,

        };

    };