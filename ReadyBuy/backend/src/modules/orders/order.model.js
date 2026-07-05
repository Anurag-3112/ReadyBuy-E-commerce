import mongoose from "mongoose";

const orderItemSchema =
    new mongoose.Schema(
        {
            product: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },

            name: {
                type: String,
                required: true,
            },

            price: {
                type: Number,
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
            },
        },
        {
            _id: false,
        }
    );

const orderSchema =
    new mongoose.Schema(
        {
            user: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            items: [orderItemSchema],

            totalAmount: {
                type: Number,
                required: true,
            },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "PAID",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                ],
                default: "PENDING",
            },
        },
        {
            timestamps: true,
        }
    );

export default mongoose.model(
    "Order",
    orderSchema
);