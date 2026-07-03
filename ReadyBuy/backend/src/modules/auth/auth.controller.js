import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    successResponse,
} from "../../shared/utils/apiResponse.js";

import {
    registerUser,
    loginUser,
} from "./auth.service.js";

export const register =
    asyncHandler(
        async (req, res) => {
            const data =
                await registerUser(
                    req.body
                );

            successResponse(
                res,
                data,
                "User registered successfully",
                201
            );
        }
    );

export const login =
    asyncHandler(
        async (req, res) => {
            const { email, password } =
                req.body;

            const result =
                await loginUser(
                    email,
                    password
                );

            successResponse(
                res,
                result,
                "Login successful"
            );
        }
    );

export const profile =
    asyncHandler(async (req, res) => {
        successResponse(
            res,
            req.user,
            "Profile fetched"
        );
    });