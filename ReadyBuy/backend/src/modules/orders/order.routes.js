import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/authorize.middleware.js";

import {
    createOrder,
    getOrders,
    getOrderById,

    getAllOrders,
    getAdminOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderStats,
    getRecentOrders,
} from "./order.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

// Customer routes

router.post(
    "/",
    authenticate,
    createOrder
);

router.get(
    "/my-orders",
    authenticate,
    getOrders
);

router.get(
    "/my-orders/:id",
    authenticate,
    getOrderById
);

router.get(
    "/stats",
    authenticate,
    authorize("ADMIN"),
    getOrderStats
);

router.get(
    "/recent",
    authenticate,
    authorize("ADMIN"),
    getRecentOrders
);

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAllOrders
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    getAdminOrder
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("ADMIN"),
    updateOrderStatus
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteOrder
);

export default router;