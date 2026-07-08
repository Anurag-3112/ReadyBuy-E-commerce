import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import validateRequest from "../../shared/middleware/validate.middleware.js";

import {
    addWishlistSchema,
} from "./wishlist.validation.js";

import {

    addWishlistController,

    getWishlistController,

    removeWishlistController,

    toggleWishlistController,

} from "./wishlist.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Wishlist Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    getWishlistController
);

router.post(
    "/",
    authenticate,
    validateRequest(
        addWishlistSchema
    ),
    addWishlistController
);

router.delete(
    "/:productId",
    authenticate,
    removeWishlistController
);

router.post(
    "/toggle/:productId",
    authenticate,
    toggleWishlistController
);

export default router;