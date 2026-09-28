import { Wishlist } from "./wishlist.model.js";

export const addWishlistRepository =
    async (payload) => {
        return await Wishlist.create(
            payload
        );
    };

export const findWishlistRepository =
    async (
        user,
        product
    ) => {
        return await Wishlist.findOne({
            user,
            product,
        });
    };

export const getWishlistRepository =
    async (userId) => {
        return await Wishlist.find({
            user: userId,
        })
            .populate({
                path: "product",
                populate: {
                    path: "category",
                },
            })
            .sort({
                createdAt: -1,
            });
    };

export const removeWishlistRepository =
    async (
        user,
        product
    ) => {
        return await Wishlist.findOneAndDelete({
            user,
            product,
        });
    };