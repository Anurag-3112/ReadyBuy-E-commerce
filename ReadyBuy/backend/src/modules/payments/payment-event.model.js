import mongoose from "mongoose";

const paymentEventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        event: {
            type: String,
            required: true,
            trim: true,
        },
        processed: {
            type: Boolean,
            default: false,
        },
        processedAt: {
            type: Date,
        },
        error: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "PaymentEvent",
    paymentEventSchema
);