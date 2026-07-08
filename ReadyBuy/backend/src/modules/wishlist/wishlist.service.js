import AppError from "../../shared/errors/AppError.js";

import Product from "../products/product.model.js";

import {
    addWishlistRepository,
    findWishlistRepository,
    getWishlistRepository,
    removeWishlistRepository,
} from "./wishlist.repository.js";

/*
|--------------------------------------------------------------------------
| Add to Wishlist
|--------------------------------------------------------------------------
*/

export const addWishlistService = async (
    userId,
    productId
) => {

    const product =
        await Product.findById(productId);

    if (!product) {

        throw new AppError(
            "Product not found.",
            404
        );

    }

    const existing =
        await findWishlistRepository(
            userId,
            productId
        );

    if (existing) {

        throw new AppError(
            "Product already exists in wishlist.",
            409
        );

    }

    return await addWishlistRepository({

        user: userId,

        product: productId,

    });

};

/*
|--------------------------------------------------------------------------
| Get Wishlist
|--------------------------------------------------------------------------
*/

export const getWishlistService = async (
    userId
) => {

    return await getWishlistRepository(
        userId
    );

};

/*
|--------------------------------------------------------------------------
| Remove Wishlist
|--------------------------------------------------------------------------
*/

export const removeWishlistService =
    async (
        userId,
        productId
    ) => {

        const item =
            await removeWishlistRepository(
                userId,
                productId
            );

        if (!item) {

            throw new AppError(
                "Wishlist item not found.",
                404
            );

        }

        return item;

    };

/*
|--------------------------------------------------------------------------
| Toggle Wishlist
|--------------------------------------------------------------------------
*/

export const toggleWishlistService =
    async (
        userId,
        productId
    ) => {

        const existing =
            await findWishlistRepository(
                userId,
                productId
            );

        if (existing) {

            await removeWishlistRepository(
                userId,
                productId
            );

            return {

                wishlisted: false,

                message:
                    "Removed from wishlist.",

            };

        }

        await addWishlistRepository({

            user: userId,

            product: productId,

        });

        return {

            wishlisted: true,

            message:
                "Added to wishlist.",

        };

    };