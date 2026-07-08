import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";

import {
    addToCart, getCart, updateCartItem, removeFromCart
} from "./cart.controller.js";

const router =
    express.Router();

router.post(
    "/",
    authenticate,
    addToCart
);

router.get(
    "/",
    authenticate,
    getCart
);

router.patch(
    "/update",
    authenticate,
    updateCartItem
);

router.delete("/remove", authenticate, removeFromCart);

export default router;