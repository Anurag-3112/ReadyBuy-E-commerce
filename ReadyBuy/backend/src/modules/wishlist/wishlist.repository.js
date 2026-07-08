import { Wishlist } from "./wishlist.model.js";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const addWishlistRepository =
    async (payload) => {

        return await Wishlist.create(
            payload
        );

    };

/*
|--------------------------------------------------------------------------
| Find
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| User Wishlist
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

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