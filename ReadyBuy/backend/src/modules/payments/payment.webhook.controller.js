import {
    processWebhook,
    verifyWebhookSignature,
} from "./payment.service.js";


export const razorpayWebhook =
    async (
        req,
        res,
        next
    ) => {

        try {

            /*
             * ------------------------------------------------
             * STEP 1
             * ------------------------------------------------
             *
             * Read Razorpay webhook headers.
             */

            const signature =
                req.headers[
                "x-razorpay-signature"
                ];


            const eventId =
                req.headers[
                "x-razorpay-event-id"
                ];


            if (!eventId) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Missing Razorpay event ID",
                    });
            }


            /*
             * ------------------------------------------------
             * STEP 2
             * ------------------------------------------------
             *
             * Get the exact raw request body.
             *
             * This MUST be the body before
             * JSON parsing.
             */
            const rawBody =
                req.rawBody;


            if (!rawBody) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Missing webhook request body",
                    });
            }


            /*
             * ------------------------------------------------
             * STEP 3
             * ------------------------------------------------
             *
             * Verify the Razorpay signature.
             *
             * Signature verification MUST happen
             * before JSON.parse().
             */
            verifyWebhookSignature({
                rawBody,

                signature,
            });


            /*
             * ------------------------------------------------
             * STEP 4
             * ------------------------------------------------
             *
             * Parse the verified payload.
             */
            let payload;

            try {

                payload =
                    JSON.parse(
                        rawBody
                    );

            } catch (error) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Invalid webhook JSON payload",
                    });
            }


            /*
             * ------------------------------------------------
             * STEP 5
             * ------------------------------------------------
             *
             * Process the webhook.
             *
             * processWebhook() handles:
             *
             * - event idempotency
             * - payment.captured
             * - payment.failed
             * - order.paid
             * - payment finalization
             * - order fulfillment
             */
            const result =
                await processWebhook({
                    eventId,

                    event:
                        payload.event,

                    payload,
                });


            /*
             * ------------------------------------------------
             * STEP 6
             * ------------------------------------------------
             *
             * Return successful response.
             */
            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        result.duplicate
                            ? "Webhook already processed"
                            : "Webhook processed",
                });

        } catch (error) {

            /*
             * Pass the error to the
             * global Express error handler.
             */
            next(error);
        }
    };