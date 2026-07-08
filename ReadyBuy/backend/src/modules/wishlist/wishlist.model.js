import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

/*
|--------------------------------------------------------------------------
| One Product Per User
|--------------------------------------------------------------------------
*/

wishlistSchema.index(
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
| Faster Queries
|--------------------------------------------------------------------------
*/

wishlistSchema.index({
    user: 1,
});

wishlistSchema.index({
    product: 1,
});

export const Wishlist = mongoose.model(
    "Wishlist",
    wishlistSchema
);