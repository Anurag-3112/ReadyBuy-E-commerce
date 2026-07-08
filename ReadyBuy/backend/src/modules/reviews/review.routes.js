import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/role.middleware.js";
import validateRequest from "../../shared/middleware/validate.middleware.js";

import {
    createReviewSchema,
    updateReviewSchema,
} from "./review.validation.js";

import {
    createReviewController,
    getReviewsByProductController,
    getMyReviewsController,
    getReviewByIdController,
    updateReviewController,
    deleteReviewController,
    getRatingSummaryController,
} from "./review.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get all reviews for a product
router.get(
    "/product/:productId",
    getReviewsByProductController
);

// Get rating summary for a product
router.get(
    "/product/:productId/summary",
    getRatingSummaryController
);

// Get single review
router.get(
    "/:id",
    getReviewByIdController
);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated Users)
|--------------------------------------------------------------------------
*/

// Get logged-in user's reviews
router.get(
    "/my/reviews",
    authenticate,
    getMyReviewsController
);

// Create review
router.post(
    "/",
    authenticate,
    validateRequest(createReviewSchema),
    createReviewController
);

// Update own review
router.patch(
    "/:id",
    authenticate,
    validateRequest(updateReviewSchema),
    updateReviewController
);

// Delete own review
router.delete(
    "/:id",
    authenticate,
    deleteReviewController
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Admin delete any review
router.delete(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    deleteReviewController
);

export default router;