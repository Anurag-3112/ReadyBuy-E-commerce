import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            default: "ReadyBuy",
        },

        category: {
            type: String,
            enum: ["men", "women", "kids"],
            required: true,
        },

        images: [
            {
                url: String,
                publicId: String,
            },
        ],

        price: {
            original: {
                type: Number,
                required: true,
            },

            discounted: {
                type: Number,
                required: true,
            },
        },

        sizes: [
            {
                name: String,
                stock: Number,
            },
        ],

        stock: {
            type: Number,
            default: 0,
        },

        rating: {
            average: {
                type: Number,
                default: 0,
            },

            count: {
                type: Number,
                default: 0,
            },
        },

        reviewCount: {
            type: Number,
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isNewArrival: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({
    name: "text",
    description: "text",
    brand: "text",
    category: 1,
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model(
    "Product",
    productSchema
);