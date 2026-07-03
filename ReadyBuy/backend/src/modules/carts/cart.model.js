import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },

        selectedSize: {
            type: String,
            default: null,
        },
    },
    {
        _id: false,
    }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },

        items: [cartItemSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Cart",
    cartSchema
);