import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        discountType: {
            type: String,
            enum: ["PERCENTAGE", "FIXED"],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        minimumOrderAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        maximumDiscount: {
            type: Number,
            default: 0,
            min: 0,
        },

        usageLimit: {
            type: Number,
            default: 1,
            min: 1,
        },

        usedCount: {
            type: Number,
            default: 0,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "INACTIVE",
                "EXPIRED",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

couponSchema.virtual("isExpired").get(function () {
    return new Date() > this.expiryDate;
});

couponSchema.set("toJSON", {
    virtuals: true,
});

couponSchema.set("toObject", {
    virtuals: true,
});

export const Coupon = mongoose.model(
    "Coupon",
    couponSchema
);