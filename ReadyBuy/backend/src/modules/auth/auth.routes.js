import express from "express";

import {
    register,
    login,
    profile,
} from "./auth.controller.js";

import validate from "../../shared/middleware/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
} from "./auth.validation.js";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/role.middleware.js";


const router =
    express.Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.get(
    "/profile",
    authenticate,
    profile
);

// router.post(
//     "/products",
//     authenticate,
//     authorize("ADMIN"),
//     createProduct
// );

export default router;