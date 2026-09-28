import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    getPaymentByOrderId,
    verifyRazorpayPayment,
} from "./payment.service.js";


/*
 * Verify Razorpay payment.
 */
export const verifyPayment =
    asyncHandler(
        async (req, res) => {

            const {
                orderId,

                razorpayOrderId,

                razorpayPaymentId,

                razorpaySignature,
            } = req.body;


            const result =
                await verifyRazorpayPayment({
                    orderId,

                    userId:
                        req.user.userId,

                    razorpayOrderId,

                    razorpayPaymentId,

                    razorpaySignature,
                });


            return res.status(200).json({
                success: true,

                message:
                    result.alreadyPaid
                        ? "Payment already verified"
                        : "Payment verified successfully",

                data:
                    result.payment,
            });
        }
    );


/*
 * Get payment by order.
 */
export const getPaymentByOrder =
    asyncHandler(
        async (req, res) => {

            const {
                orderId,
            } = req.params;


            const payment =
                await getPaymentByOrderId(
                    orderId
                );


            if (!payment) {

                return res.status(404)
                    .json({
                        success: false,

                        message:
                            "Payment not found",
                    });
            }


            /*
             * Do not allow a customer
             * to access another user's
             * payment information.
             */
            if (
                payment.user.toString() !==
                req.user.userId.toString()
            ) {

                return res.status(403)
                    .json({
                        success: false,

                        message:
                            "Unauthorized",
                    });
            }


            return res.status(200).json({
                success: true,

                data: payment,
            });
        }
    );
