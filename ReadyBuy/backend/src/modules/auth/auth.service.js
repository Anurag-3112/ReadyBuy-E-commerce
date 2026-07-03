import bcrypt from "bcrypt";
import AppError from "../../shared/errors/AppError.js";

import {
    createUser,
    findUserByEmail,
} from "../users/user.repository.js";

import {
    generateAccessToken,
    generateRefreshToken,
} from "../../shared/utils/jwt.js";

import { toUserResponse } from "../users/user.mapper.js";

export const registerUser = async (
    userData
) => {
    const existingUser =
        await findUserByEmail(
            userData.email
        );

    if (existingUser) {
        throw new AppError(
            "Email already exists",
            409
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            userData.password,
            10
        );

    const user =
        await createUser({
            ...userData,
            password: hashedPassword,
        });

    const payload = {
        userId: user._id,
        role: user.role,
    };

    const accessToken =
        generateAccessToken(payload);

    const refreshToken =
        generateRefreshToken(payload);

    user.refreshToken =
        refreshToken;

    await user.save();

    return {
        user: toUserResponse(user),
        accessToken,
        refreshToken,
    };
};

export const loginUser = async (
    email,
    password
) => {
    const user =
        await findUserByEmail(email);

    if (!user) {
        throw new AppError(
            "Invalid credentials",
            401
        );
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new AppError(
            "Invalid credentials",
            401
        );
    }

    const payload = {
        userId: user._id,
        role: user.role,
    };

    const accessToken =
        generateAccessToken(payload);

    const refreshToken =
        generateRefreshToken(payload);

    user.refreshToken =
        refreshToken;

    await user.save();

    return {
        user: toUserResponse(user),
        accessToken,
        refreshToken,
    };
};