import AppError from "../../shared/errors/AppError.js";

import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";

import {
    createReviewRepository,
    getReviewByIdRepository,
    getReviewByUserAndProductRepository,
    getReviewsByProductRepository,
    getReviewsByUserRepository,
    updateReviewRepository,
    deleteReviewRepository,
    getProductReviewStatsRepository,
    getRatingDistributionRepository,
} from "./review.repository.js";

/*
|--------------------------------------------------------------------------
| Update Product Rating
|--------------------------------------------------------------------------
*/

const updateProductRating = async (productId) => {

    const stats =
        await getProductReviewStatsRepository(productId);

    await Product.findByIdAndUpdate(
        productId,
        {
            rating: Number(
                stats.averageRating.toFixed(1)
            ),
            reviewCount: stats.reviewCount,
        }
    );

};

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReviewService = async (
    userId,
    payload
) => {

    const existing =
        await getReviewByUserAndProductRepository(
            userId,
            payload.product
        );

    if (existing) {

        throw new AppError(
            "You have already reviewed this product.",
            409
        );

    }

    /*
    ---------------------------------------------------------
    Optional Verified Purchase Check
    ---------------------------------------------------------
    */

    const order =
        await Order.findOne({

            user: userId,

            "items.product":
                payload.product,

            orderStatus:
                "DELIVERED",

        });

    const review =
        await createReviewRepository({

            ...payload,

            user: userId,

            isVerifiedPurchase:
                !!order,

        });

    await updateProductRating(
        payload.product
    );

    return review;

};

/*
|--------------------------------------------------------------------------
| Get Reviews By Product
|--------------------------------------------------------------------------
*/

export const getReviewsByProductService =
    async (
        productId,
        query
    ) => {

        return await getReviewsByProductRepository({

            product: productId,

            ...query,

        });

    };

/*
|--------------------------------------------------------------------------
| Get Reviews By User
|--------------------------------------------------------------------------
*/

export const getReviewsByUserService =
    async (userId) => {

        return await getReviewsByUserRepository(
            userId
        );

    };

/*
|--------------------------------------------------------------------------
| Get Review
|--------------------------------------------------------------------------
*/

export const getReviewByIdService =
    async (id) => {

        const review =
            await getReviewByIdRepository(id);

        if (!review) {

            throw new AppError(
                "Review not found.",
                404
            );

        }

        return review;

    };

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReviewService =
    async (
        id,
        userId,
        payload
    ) => {

        const review =
            await getReviewByIdRepository(id);

        if (!review) {

            throw new AppError(
                "Review not found.",
                404
            );

        }

        if (
            review.user._id.toString() !==
            userId
        ) {

            throw new AppError(
                "Unauthorized.",
                403
            );

        }

        const updated =
            await updateReviewRepository(
                id,
                payload
            );

        await updateProductRating(
            review.product._id
        );

        return updated;

    };

/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

export const deleteReviewService =
    async (
        id,
        userId,
        isAdmin = false
    ) => {

        const review =
            await getReviewByIdRepository(id);

        if (!review) {

            throw new AppError(
                "Review not found.",
                404
            );

        }

        if (
            !isAdmin &&
            review.user._id.toString() !==
            userId
        ) {

            throw new AppError(
                "Unauthorized.",
                403
            );

        }

        await deleteReviewRepository(id);

        await updateProductRating(
            review.product._id
        );

    };

/*
|--------------------------------------------------------------------------
| Rating Summary
|--------------------------------------------------------------------------
*/

export const getRatingSummaryService =
    async (productId) => {

        const stats =
            await getProductReviewStatsRepository(
                productId
            );

        const distribution =
            await getRatingDistributionRepository(
                productId
            );

        return {

            averageRating:
                stats.averageRating || 0,

            reviewCount:
                stats.reviewCount || 0,

            distribution,

        };

    };