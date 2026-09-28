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

export const createCouponService = async (payload) => {
    const exists = await getCouponByCodeRepository(payload.code);

    if (exists) {
        throw new AppError(
            "Coupon already exists.",
            409
        );
    }

    return await createCouponRepository(payload);
};

export const getCouponsService = async (query) => {
    return await getCouponsRepository(query);
};

export const getAvailableCouponsService = async () => {
    const result = await getCouponsRepository({
        page: 1,
        limit: 100,
        status: "ACTIVE",
    });

    const now = new Date();

    result.docs = result.docs.filter(
        (coupon) =>
            coupon.expiryDate > now &&
            coupon.usedCount < coupon.usageLimit
    );

    result.totalDocs = result.docs.length;
    result.totalPages = 1;
    result.hasPrevPage = false;
    result.hasNextPage = false;

    return result;
};

export const getCouponByIdService = async (id) => {
    const coupon = await getCouponByIdRepository(id);

    if (!coupon) {
        throw new AppError(
            "Coupon not found.",
            404
        );
    }

    return coupon;
};

export const updateCouponService = async (id, payload) => {
    if (payload.code) {
        const existing = await getCouponByCodeRepository(
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

    const updated = await updateCouponRepository(
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

export const deleteCouponService = async (id) => {
    const deleted = await deleteCouponRepository(id);

    if (!deleted) {
        throw new AppError(
            "Coupon not found.",
            404
        );
    }

    return deleted;
};

export const applyCouponService = async ({
    code,
    orderTotal,
}) => {
    if (
        !code ||
        typeof orderTotal !== "number" ||
        orderTotal < 0
    ) {
        throw new AppError(
            "Invalid coupon request.",
            400
        );
    }

    const coupon = await getCouponByCodeRepository(code);

    if (!coupon) {
        throw new AppError(
            "Invalid coupon.",
            404
        );
    }

    if (coupon.status !== "ACTIVE") {
        throw new AppError(
            "Coupon is inactive.",
            400
        );
    }

    if (coupon.expiryDate < new Date()) {
        throw new AppError(
            "Coupon has expired.",
            400
        );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
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

    if (coupon.discountType === "PERCENTAGE") {
        discount =
            (orderTotal *
                coupon.discountValue) /
            100;

        if (coupon.maximumDiscount > 0) {
            discount = Math.min(
                discount,
                coupon.maximumDiscount
            );
        }
    } else {
        discount = coupon.discountValue;
    }

    discount = Math.min(
        discount,
        orderTotal
    );

    discount = Number(
        discount.toFixed(2)
    );

    const finalTotal = Number(
        Math.max(
            orderTotal - discount,
            0
        ).toFixed(2)
    );

    return {
        coupon,
        discount,
        finalTotal,
    };
};

export const consumeCouponService = async (couponId) => {
    const coupon =
        await incrementCouponUsageRepository(
            couponId
        );

    if (!coupon) {
        throw new AppError(
            "Coupon usage limit exceeded.",
            400
        );
    }

    return coupon;
};