import AppError from "../../shared/errors/AppError.js";
import {
    createCouponRepository,
    getCouponsRepository,
    getCouponByIdRepository,
    getCouponByCodeRepository,
    updateCouponRepository,
    deleteCouponRepository,
    incrementCouponUsageRepository,
} from "./coupon.repository.js";

/**
 * Create Coupon
 */
export const createCouponService = async (
    payload
) => {

    const exists =
        await getCouponByCodeRepository(
            payload.code
        );

    if (exists) {

        throw new AppError(
            "Coupon already exists.",
            409
        );

    }

    return await createCouponRepository(
        payload
    );

};

/**
 * Get Coupons
 */
export const getCouponsService = async (
    query
) => {

    return await getCouponsRepository(
        query
    );

};

/**
 * Get Coupon
 */
export const getCouponByIdService = async (
    id
) => {

    const coupon =
        await getCouponByIdRepository(id);

    if (!coupon) {

        throw new AppError(
            "Coupon not found.",
            404
        );

    }

    return coupon;

};

/**
 * Update Coupon
 */
export const updateCouponService = async (
    id,
    payload
) => {

    if (payload.code) {

        const existing =
            await getCouponByCodeRepository(
                payload.code
            );

        if (
            existing &&
            existing._id.toString() !== id
        ) {

            throw new AppError(
                "Coupon code already exists.",
                409
            );

        }

    }

    const updated =
        await updateCouponRepository(
            id,
            payload
        );

    if (!updated) {

        throw new AppError(
            "Coupon not found.",
            404
        );

    }

    return updated;

};

/**
 * Delete Coupon
 */
export const deleteCouponService = async (
    id
) => {

    const deleted =
        await deleteCouponRepository(id);

    if (!deleted) {

        throw new AppError(
            "Coupon not found.",
            404
        );

    }

    return deleted;

};

/**
 * Apply Coupon
 */
export const applyCouponService = async ({
    code,
    orderTotal,
}) => {

    const coupon =
        await getCouponByCodeRepository(code);

    if (!coupon) {

        throw new AppError(
            "Invalid coupon.",
            404
        );

    }

    if (
        coupon.status !== "ACTIVE"
    ) {

        throw new AppError(
            "Coupon is inactive.",
            400
        );

    }

    if (
        coupon.expiryDate <
        new Date()
    ) {

        throw new AppError(
            "Coupon has expired.",
            400
        );

    }

    if (
        coupon.usedCount >=
        coupon.usageLimit
    ) {

        throw new AppError(
            "Coupon usage limit exceeded.",
            400
        );

    }

    if (
        orderTotal <
        coupon.minimumOrderAmount
    ) {

        throw new AppError(

            `Minimum order amount is ₹${coupon.minimumOrderAmount}.`,

            400

        );

    }

    let discount = 0;

    if (
        coupon.discountType ===
        "PERCENTAGE"
    ) {

        discount =
            (orderTotal *
                coupon.discountValue) /
            100;

        if (
            coupon.maximumDiscount > 0
        ) {

            discount = Math.min(

                discount,

                coupon.maximumDiscount

            );

        }

    } else {

        discount =
            coupon.discountValue;

    }

    const finalTotal =
        Math.max(
            orderTotal - discount,
            0
        );

    return {

        coupon,

        discount,

        finalTotal,

    };

};

/**
 * Consume Coupon
 */
export const consumeCouponService =
    async (couponId) => {

        return await incrementCouponUsageRepository(
            couponId
        );

    };