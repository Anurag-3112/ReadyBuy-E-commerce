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

                min: 0,
            },

            quantity: {
                type: Number,

                required: true,

                min: 1,
            },
        },

        {
            _id: false,
        }
    );


const shippingAddressSchema =
    new mongoose.Schema(
        {
            fullName: {
                type: String,

                required: true,

                trim: true,
            },

            phone: {
                type: String,

                required: true,

                trim: true,
            },

            addressLine1: {
                type: String,

                required: true,

                trim: true,
            },

            addressLine2: {
                type: String,

                trim: true,

                default: "",
            },

            city: {
                type: String,

                required: true,

                trim: true,
            },

            state: {
                type: String,

                required: true,

                trim: true,
            },

            pincode: {
                type: String,

                required: true,

                trim: true,
            },

            country: {
                type: String,

                required: true,

                trim: true,

                default: "India",
            },
        },

        {
            _id: false,
        }
    );


const fulfillmentSchema =
    new mongoose.Schema(
        {
            inventoryPublished: {
                type: Boolean,

                default: false,
            },

            inventoryPublishedAt: {
                type: Date,
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

                index: true,
            },

            items: {
                type: [orderItemSchema],

                validate: {
                    validator:
                        (items) =>
                            items.length > 0,

                    message:
                        "Order must contain at least one item",
                },
            },

            totalAmount: {
                type: Number,

                required: true,

                min: 0,
            },

            shippingAddress: {
                type:
                    shippingAddressSchema,

                required: true,
            },

            paymentMethod: {
                type: String,

                enum: [
                    "COD",
                    "RAZORPAY",
                ],

                required: true,
            },

            status: {
                type: String,

                enum: [
                    "PENDING",
                    "CONFIRMED",
                    "PROCESSING",
                    "SHIPPED",
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                    "CANCELLED",
                ],

                default: "PENDING",

                index: true,
            },

            fulfillment: {
                type:
                    fulfillmentSchema,

                default: () => ({}),
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