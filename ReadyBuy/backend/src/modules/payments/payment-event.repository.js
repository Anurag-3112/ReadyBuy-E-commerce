import PaymentEvent from "./payment-event.model.js";

export const findEventById = (eventId) =>
    PaymentEvent.findOne({
        eventId,
    });

export const createEvent = (eventData) =>
    PaymentEvent.create(eventData);

export const markEventProcessed = (eventId) =>
    PaymentEvent.findOneAndUpdate(
        {
            eventId,
        },
        {
            processed: true,
            processedAt: new Date(),
        },
        {
            new: true,
        }
    );

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