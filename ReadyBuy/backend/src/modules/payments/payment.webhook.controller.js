import {
    processWebhook,
    verifyWebhookSignature,
} from "./payment.service.js";

export const razorpayWebhook = async (
    req,
    res,
    next
) => {
    try {
        const signature =
            req.headers["x-razorpay-signature"];

        const eventId =
            req.headers["x-razorpay-event-id"];

        if (!eventId) {
            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Missing Razorpay event ID",
                });
        }

        const rawBody = req.rawBody;

        if (!rawBody) {
            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Missing webhook request body",
                });
        }

        verifyWebhookSignature({
            rawBody,
            signature,
        });

        let payload;

        try {
            payload = JSON.parse(rawBody);
        } catch (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Invalid webhook JSON payload",
                });
        }

        const result = await processWebhook({
            eventId,
            event: payload.event,
            payload,
        });

        return res
            .status(200)
            .json({
                success: true,
                message: result.duplicate
                    ? "Webhook already processed"
                    : "Webhook processed",
            });
    } catch (error) {
        next(error);
    }
};