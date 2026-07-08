import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000,
        },

        images: [
            {
                type: String,
            },
        ],

        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },

        likes: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "HIDDEN",
                "REPORTED",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Reviews
|--------------------------------------------------------------------------
*/

reviewSchema.index(
    {
        user: 1,
        product: 1,
    },
    {
        unique: true,
    }
);

/*
|--------------------------------------------------------------------------
| Product Reviews
|--------------------------------------------------------------------------
*/

reviewSchema.index({
    product: 1,
});

reviewSchema.index({
    rating: -1,
});

export const Review = mongoose.model(
    "Review",
    reviewSchema
);