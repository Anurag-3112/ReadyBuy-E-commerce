import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/role.middleware.js";

import {
    getStats,
    monthlyRevenue,
} from "./admin.controller.js";

// import orderRoutes from "./orders/order.routes.js";

const router = express.Router();

// router.use("/orders", orderRoutes);

router.get(
    "/stats",
    authenticate,
    authorize("ADMIN"),
    getStats
);

router.get(
    "/revenue",
    authenticate,
    authorize("ADMIN"),
    monthlyRevenue
);

export default router;