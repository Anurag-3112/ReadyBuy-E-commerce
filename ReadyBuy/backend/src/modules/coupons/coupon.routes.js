import { Router } from "express";

import {
    createCouponController,
    getCouponsController,
    getCouponByIdController,
    updateCouponController,
    deleteCouponController,
    applyCouponController,
    consumeCouponController,
} from "./coupon.controller.js";

import {
    createCouponSchema,
    updateCouponSchema,
} from "./coupon.validation.js";

import validate from "../../shared/middleware/validate.middleware.js";
import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/authorize.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/v1/coupons
 */
router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getCouponsController
);

/**
 * GET /api/v1/coupons/:id
 */
router.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    getCouponByIdController
);

/**
 * POST /api/v1/coupons
 */
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createCouponSchema),
    createCouponController
);

/**
 * PATCH /api/v1/coupons/:id
 */
router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(updateCouponSchema),
    updateCouponController
);

/**
 * DELETE /api/v1/coupons/:id
 */
router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCouponController
);

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

/**
 * Validate / Apply Coupon
 */
router.post(
    "/apply",
    authenticate,
    applyCouponController
);

/**
 * Consume Coupon
 * (Call after successful payment)
 */
router.post(
    "/:id/consume",
    authenticate,
    consumeCouponController
);

export default router;