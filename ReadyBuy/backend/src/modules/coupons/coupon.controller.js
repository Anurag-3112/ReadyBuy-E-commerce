import asyncHandler from "../../shared/utils/asyncHandler.js";
import {
    createCouponService,
    getCouponsService,
    getAvailableCouponsService,
    getCouponByIdService,
    updateCouponService,
    deleteCouponService,
    applyCouponService,
    consumeCouponService,
} from "./coupon.service.js";

export const createCouponController = asyncHandler(async (req, res) => {
    const coupon = await createCouponService(req.body);

    return res.status(201).json({
        success: true,
        message: "Coupon created successfully.",
        data: coupon,
    });
});

export const getCouponsController = asyncHandler(async (req, res) => {
    const coupons = await getCouponsService(req.query);

    return res.json({
        success: true,
        message: "Coupons fetched successfully.",
        data: coupons,
    });
});

export const getAvailableCouponsController = asyncHandler(async (req, res) => {
    const coupons = await getAvailableCouponsService();

    return res.json({
        success: true,
        message: "Available coupons fetched successfully.",
        data: coupons,
    });
});

export const getCouponByIdController = asyncHandler(async (req, res) => {
    const coupon = await getCouponByIdService(req.params.id);

    return res.json({
        success: true,
        message: "Coupon fetched successfully.",
        data: coupon,
    });
});

export const updateCouponController = asyncHandler(async (req, res) => {
    const coupon = await updateCouponService(
        req.params.id,
        req.body
    );

    return res.json({
        success: true,
        message: "Coupon updated successfully.",
        data: coupon,
    });
});

export const deleteCouponController = asyncHandler(async (req, res) => {
    await deleteCouponService(req.params.id);

    return res.json({
        success: true,
        message: "Coupon deleted successfully.",
    });
});

export const applyCouponController = asyncHandler(async (req, res) => {
    const result = await applyCouponService({
        code: req.body.code,
        orderTotal: req.body.orderTotal,
    });

    return res.json({
        success: true,
        message: "Coupon applied successfully.",
        data: result,
    });
});

export const consumeCouponController = asyncHandler(async (req, res) => {
    const coupon = await consumeCouponService(req.params.id);

    return res.json({
        success: true,
        message: "Coupon usage updated.",
        data: coupon,
    });
});