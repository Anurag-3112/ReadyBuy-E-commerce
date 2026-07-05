import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/role.middleware.js";

import {
    getStats,
    monthlyRevenue,
} from "./admin.controller.js";

import orderRoutes from "../orders/order.routes.js";
import userRoutes from "../users/user.routes.js";

const router = express.Router();

router.use(
    "/orders",
    authenticate,
    authorize("ADMIN"),
    orderRoutes
);

router.use(
    "/users",
    authenticate,
    authorize("ADMIN"),
    userRoutes
);

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