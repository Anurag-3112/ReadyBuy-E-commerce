import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/role.middleware.js";

import {
    getStats,
    monthlyRevenue,
    getTopProducts,
    getTopCategories,
    getRecentOrders,
    getLowStockProducts,
} from "./admin.controller.js";

import orderRoutes from "../orders/order.routes.js";
import userRoutes from "../users/user.routes.js";
import couponRoutes from "../coupons/coupon.routes.js";

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

router.use(
    "/coupons",
    authenticate,
    authorize("ADMIN"),
    couponRoutes
);

router.get(
    "/top-products",
    authenticate,
    authorize("ADMIN"),
    getTopProducts
);

router.get(
    "/top-categories",
    authenticate,
    authorize("ADMIN"),
    getTopCategories
);

router.get(
    "/recent-orders",
    authenticate,
    authorize("ADMIN"),
    getRecentOrders
);

router.get(
    "/low-stock",
    authenticate,
    authorize("ADMIN"),
    getLowStockProducts
);

export default router;