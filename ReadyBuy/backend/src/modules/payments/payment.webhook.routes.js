import express from "express";
import {
    razorpayWebhook,
} from "./payment.webhook.controller.js";

const router = express.Router();

router.post(
    "/razorpay",
    express.raw({
        type: "application/json",
    }),
    (req, res, next) => {
        req.rawBody = req.body.toString("utf8");
        next();
    },
    razorpayWebhook
);

export default router;