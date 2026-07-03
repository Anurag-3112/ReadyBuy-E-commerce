import express from "express";

import {
    createCategory,
    getCategories,
    getAllCategories,
    getCategory,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/authorize.middleware.js";

const router = express.Router();

router.get(
    "/",
    getCategories
);

router.get(
    "/slug/:slug",
    getCategoryBySlug
);

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    getAllCategories
);

router.get(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    getCategory
);

router.post(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    createCategory
);

router.put(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    updateCategory
);

router.delete(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCategory
);

export default router;