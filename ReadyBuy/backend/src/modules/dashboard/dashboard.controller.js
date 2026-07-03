import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    getDashboardService,
} from "./dashboard.service.js";

export const getDashboard =
    asyncHandler(async (req, res) => {

        const dashboard =
            await getDashboardService();

        return res.status(200).json({

            success: true,

            data: dashboard,

        });

    });