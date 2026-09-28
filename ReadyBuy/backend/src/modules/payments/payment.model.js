import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
            index: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            required: true,
            uppercase: true,
            default: "INR",
        },

        method: {
            type: String,
            enum: [
                "COD",
                "RAZORPAY",
            ],
            required: true,
        },

        gateway: {
            type: String,
            enum: [
                "NONE",
                "RAZORPAY",
            ],
            required: true,
            default: "NONE",
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CREATED",
                "AUTHORIZED",
                "PAID",
                "FAILED",
                "REFUNDED",
                "PARTIALLY_REFUNDED",
            ],
            default: "PENDING",
            index: true,
        },

        gatewayOrderId: {
            type: String,
            trim: true,
            index: true,
        },

        gatewayPaymentId: {
            type: String,
            trim: true,
            index: true,
        },

        gatewaySignature: {
            type: String,
            trim: true,
        },

        failureReason: {
            type: String,
            trim: true,
        },

        paidAt: {
            type: Date,
        },

        refundedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model(
    "Payment",
    paymentSchema
);

export default Payment;