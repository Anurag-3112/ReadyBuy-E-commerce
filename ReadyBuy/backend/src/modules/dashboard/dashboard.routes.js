import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/authorize.middleware.js";

import {
    getDashboard,
} from "./dashboard.controller.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getDashboard
);

export default router;