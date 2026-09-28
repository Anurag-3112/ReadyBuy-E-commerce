import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";

import {
    verifyPayment,
    getPaymentByOrder,
} from "./payment.controller.js";


const router =
    express.Router();


/*
 * Verify Razorpay payment
 *
 * POST /api/v1/payments/verify
 */
router.post(
    "/verify",
    authenticate,
    verifyPayment
);


/*
 * Get payment for an order
 *
 * GET /api/v1/payments/order/:orderId
 */
router.get(
    "/order/:orderId",
    authenticate,
    getPaymentByOrder
);


export default router;