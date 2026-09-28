import express from "express";

import {
    razorpayWebhook,
} from "./payment.webhook.controller.js";


const router =
    express.Router();


/*
 * POST
 *
 * /api/v1/payments/webhook/razorpay
 *
 * IMPORTANT:
 *
 * This route must receive the
 * raw request body.
 */
router.post(
    "/razorpay",

    express.raw({
        type: "application/json",
    }),

    (req, res, next) => {

        /*
         * Convert Buffer to string.
         *
         * DO NOT JSON.parse() yet.
         *
         * Signature verification must
         * use the exact raw body.
         */
        req.rawBody =
            req.body.toString(
                "utf8"
            );

        next();
    },

    razorpayWebhook
);


export default router;