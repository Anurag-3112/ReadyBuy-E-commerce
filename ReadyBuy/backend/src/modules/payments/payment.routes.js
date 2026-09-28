import express from "express";
import authenticate from "../../shared/middleware/auth.middleware.js";
import {
    verifyPayment,
    getPaymentByOrder,
} from "./payment.controller.js";

const router = express.Router();

router.post(
    "/verify",
    authenticate,
    verifyPayment
);

router.get(
    "/order/:orderId",
    authenticate,
    getPaymentByOrder
);

export default router;