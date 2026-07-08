import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    createReviewService,
    getReviewsByProductService,
    getReviewsByUserService,
    getReviewByIdService,
    updateReviewService,
    deleteReviewService,
    getRatingSummaryService,
} from "./review.service.js";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReviewController = asyncHandler(
    async (req, res) => {

        const review =
            await createReviewService(
                req.user._id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message: "Review created successfully.",
            data: review,
        });

    }
);

/*
|--------------------------------------------------------------------------
| Get Reviews By Product
|--------------------------------------------------------------------------
*/

export const getReviewsByProductController =
    asyncHandler(async (req, res) => {

        const reviews =
            await getReviewsByProductService(
                req.params.productId,
                req.query
            );

        return res.json({
            success: true,
            message: "Reviews fetched successfully.",
            data: reviews,
        });

    });

/*
|--------------------------------------------------------------------------
| Get My Reviews
|--------------------------------------------------------------------------
*/

export const getMyReviewsController =
    asyncHandler(async (req, res) => {

        const reviews =
            await getReviewsByUserService(
                req.user._id
            );

        return res.json({
            success: true,
            message: "Reviews fetched successfully.",
            data: reviews,
        });

    });

/*
|--------------------------------------------------------------------------
| Get Review By ID
|--------------------------------------------------------------------------
*/

export const getReviewByIdController =
    asyncHandler(async (req, res) => {

        const review =
            await getReviewByIdService(
                req.params.id
            );

        return res.json({
            success: true,
            message: "Review fetched successfully.",
            data: review,
        });

    });

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReviewController =
    asyncHandler(async (req, res) => {

        const review =
            await updateReviewService(

                req.params.id,

                req.user._id,

                req.body

            );

        return res.json({
            success: true,
            message: "Review updated successfully.",
            data: review,
        });

    });

/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

export const deleteReviewController =
    asyncHandler(async (req, res) => {

        await deleteReviewService(

            req.params.id,

            req.user._id,

            req.user.role === "ADMIN"

        );

        return res.json({
            success: true,
            message: "Review deleted successfully.",
        });

    });

/*
|--------------------------------------------------------------------------
| Rating Summary
|--------------------------------------------------------------------------
*/

export const getRatingSummaryController =
    asyncHandler(async (req, res) => {

        const summary =
            await getRatingSummaryService(
                req.params.productId
            );

        return res.json({
            success: true,
            message: "Rating summary fetched successfully.",
            data: summary,
        });

    });