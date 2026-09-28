import { Router } from "express";
import {
    createCouponController,
    getCouponsController,
    getAvailableCouponsController,
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

router.get(
    "/available",
    authenticate,
    getAvailableCouponsController
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getCouponsController
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    getCouponByIdController
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createCouponSchema),
    createCouponController
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(updateCouponSchema),
    updateCouponController
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCouponController
);

router.post(
    "/apply",
    authenticate,
    applyCouponController
);

router.post(
    "/:id/consume",
    authenticate,
    consumeCouponController
);

export default router;