import asyncHandler from "../../shared/utils/asyncHandler.js";
import {
    getDashboardStats,
    getMonthlyRevenue,
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