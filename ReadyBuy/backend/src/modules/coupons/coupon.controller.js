import asyncHandler from "../../shared/utils/asyncHandler.js";
import {
    createCouponService,
    getCouponsService,
    getCouponByIdService,
    updateCouponService,
    deleteCouponService,
    applyCouponService,
    consumeCouponService,
} from "./coupon.service.js";

/**
 * Create Coupon
 */
export const createCouponController =
    asyncHandler(async (req, res) => {

        const coupon =
            await createCouponService(
                req.body
            );

        return res.status(201).json({

            success: true,

            message:
                "Coupon created successfully.",

            data: coupon,

        });

    });

/**
 * Get Coupons
 */
export const getCouponsController =
    asyncHandler(async (req, res) => {

        const coupons =
            await getCouponsService(
                req.query
            );

        return res.json({

            success: true,

            message:
                "Coupons fetched successfully.",

            data: coupons,

        });

    });

/**
 * Get Coupon By ID
 */
export const getCouponByIdController =
    asyncHandler(async (req, res) => {

        const coupon =
            await getCouponByIdService(
                req.params.id
            );

        return res.json({

            success: true,

            message:
                "Coupon fetched successfully.",

            data: coupon,

        });

    });

/**
 * Update Coupon
 */
export const updateCouponController =
    asyncHandler(async (req, res) => {

        const coupon =
            await updateCouponService(

                req.params.id,

                req.body

            );

        return res.json({

            success: true,

            message:
                "Coupon updated successfully.",

            data: coupon,

        });

    });

/**
 * Delete Coupon
 */
export const deleteCouponController =
    asyncHandler(async (req, res) => {

        await deleteCouponService(
            req.params.id
        );

        return res.json({

            success: true,

            message:
                "Coupon deleted successfully.",

        });

    });

/**
 * Apply Coupon
 */
export const applyCouponController =
    asyncHandler(async (req, res) => {

        const result =
            await applyCouponService({

                code: req.body.code,

                orderTotal:
                    req.body.orderTotal,

            });

        return res.json({

            success: true,

            message:
                "Coupon applied successfully.",

            data: result,

        });

    });

/**
 * Consume Coupon
 *
 * Call this AFTER
 * successful payment.
 */
export const consumeCouponController =
    asyncHandler(async (req, res) => {

        const coupon =
            await consumeCouponService(

                req.params.id

            );

        return res.json({

            success: true,

            message:
                "Coupon usage updated.",

            data: coupon,

        });

    });