import express from "express";

import {
    createProduct,
    getProducts,
} from "./product.controller.js";

import authenticate from "../../shared/middleware/auth.middleware.js";
import { getProductBySlug } from "./product.controller.js";
import authorize from "../../shared/middleware/role.middleware.js";
import { updateProduct, deleteProduct } from "./product.controller.js";
import validate from "../../shared/middleware/validate.middleware.js";
import upload from "../../shared/middleware/upload.middleware.js";

import {
    createProductSchema,
} from "./product.validation.js";

const router = express.Router();

router.get("/", getProducts);

router.get(
    "/:slug",
    getProductBySlug
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateProduct
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    upload.array("images", 5),
    createProduct
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteProduct
);

export default router;