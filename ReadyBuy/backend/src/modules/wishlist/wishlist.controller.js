import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    addWishlistService,
    getWishlistService,
    removeWishlistService,
    toggleWishlistService,
} from "./wishlist.service.js";

/*
|--------------------------------------------------------------------------
| Add Product To Wishlist
|--------------------------------------------------------------------------
*/

export const addWishlistController =
    asyncHandler(async (req, res) => {

        const wishlist =
            await addWishlistService(

                req.user.userId,

                req.body.product

            );

        return res.status(201).json({

            success: true,

            message:
                "Product added to wishlist.",

            data: wishlist,

        });

    });

/*
|--------------------------------------------------------------------------
| Get User Wishlist
|--------------------------------------------------------------------------
*/

export const getWishlistController =
    asyncHandler(async (req, res) => {

        const wishlist =
            await getWishlistService(
                req.user.userId
            );

        return res.json({

            success: true,

            message:
                "Wishlist fetched successfully.",

            data: wishlist,

        });

    });

/*
|--------------------------------------------------------------------------
| Remove Wishlist Item
|--------------------------------------------------------------------------
*/

export const removeWishlistController =
    asyncHandler(async (req, res) => {

        await removeWishlistService(

            req.user.userId,

            req.params.productId

        );

        return res.json({

            success: true,

            message:
                "Product removed from wishlist.",

        });

    });

/*
|--------------------------------------------------------------------------
| Toggle Wishlist
|--------------------------------------------------------------------------
*/

export const toggleWishlistController =
    asyncHandler(async (req, res) => {

        const result =
            await toggleWishlistService(

                req.user.userId,

                req.params.productId

            );

        return res.json({

            success: true,

            message: result.message,

            data: {

                wishlisted:
                    result.wishlisted,

            },

        });

    });