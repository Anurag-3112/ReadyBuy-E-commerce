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

router.get(
    "/product/:productId",
    getReviewsByProductController
);

router.get(
    "/product/:productId/summary",
    getRatingSummaryController
);

router.get(
    "/:id",
    getReviewByIdController
);

router.get(
    "/my/reviews",
    authenticate,
    getMyReviewsController
);

router.post(
    "/",
    authenticate,
    validateRequest(createReviewSchema),
    createReviewController
);

router.patch(
    "/:id",
    authenticate,
    validateRequest(updateReviewSchema),
    updateReviewController
);

router.delete(
    "/:id",
    authenticate,
    deleteReviewController
);

router.delete(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    deleteReviewController
);

export default router;