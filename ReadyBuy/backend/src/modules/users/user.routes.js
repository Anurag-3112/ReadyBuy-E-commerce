import express from "express";

import authenticate from "../../shared/middleware/auth.middleware.js";
import authorize from "../../shared/middleware/role.middleware.js";

import {
    getUsers,
    getUser,
    updateRole,
    updateStatus,
    deleteUser,
} from "./user.controller.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getUsers
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    getUser
);

router.patch(
    "/:id/role",
    authenticate,
    authorize("ADMIN"),
    updateRole
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("ADMIN"),
    updateStatus
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteUser
);

export default router;