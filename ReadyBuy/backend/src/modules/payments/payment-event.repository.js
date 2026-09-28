import PaymentEvent from "./payment-event.model.js";


/*
 * Find payment event by event ID.
 */
export const findEventById = (
    eventId
) =>
    PaymentEvent.findOne({
        eventId,
    });


/*
 * Create a payment event.
 */
export const createEvent = (
    eventData
) =>
    PaymentEvent.create(
        eventData
    );


/*
 * Mark payment event as processed.
 */
export const markEventProcessed = (
    eventId
) =>
    PaymentEvent.findOneAndUpdate(
        {
            eventId,
        },

        {
            processed: true,

            processedAt:
                new Date(),
        },

        {
            new: true,
        }
    );


/*
 * Mark payment event as failed.
 */
export const markEventFailed = (
    eventId,
    error
) =>
    PaymentEvent.findOneAndUpdate(
        {
            eventId,
        },

        {
            processed: false,

            error:
                error?.message ||
                "Webhook processing failed",
        },

        {
            new: true,
        }
    );