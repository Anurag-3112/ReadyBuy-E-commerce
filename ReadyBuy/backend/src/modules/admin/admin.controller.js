import asyncHandler from "../../shared/utils/asyncHandler.js";
import {
    getDashboardStats,
    getMonthlyRevenue,
    getTopProductsService,
    getTopCategoriesService,
    getRecentOrdersService,
    getLowStockProductsService,
} from "./admin.service.js";

export const getStats =
    asyncHandler(async (
        req,
        res
    ) => {

        const stats =
            await getDashboardStats();

        return res.status(200).json({
            success: true,
            data: stats,
        });
    });


export const monthlyRevenue =
    asyncHandler(async (
        req,
        res
    ) => {

        const data =
            await getMonthlyRevenue();

        res.json({
            success: true,
            data,
        });
    });

export const getTopProducts = asyncHandler(async (req, res) => {

    const products = await getTopProductsService();

    res.json({
        success: true,
        data: products,
    });

});

export const getTopCategories = asyncHandler(async (req, res) => {

    const categories = await getTopCategoriesService();

    res.json({
        success: true,
        data: categories,
    });

});

export const getRecentOrders = asyncHandler(async (req, res) => {

    const orders = await getRecentOrdersService();

    res.json({
        success: true,
        data: orders,
    });

});

export const getLowStockProducts = asyncHandler(async (req, res) => {

    const products = await getLowStockProductsService();

    res.json({
        success: true,
        data: products,
    });

});