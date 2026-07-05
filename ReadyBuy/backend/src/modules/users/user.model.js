import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        phone: {
            type: String,
            default: "",
        },

        avatar: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["ACTIVE", "BLOCKED"],
            default: "ACTIVE",
        },

        lastLogin: {
            type: Date,
        },

        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }],

        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;