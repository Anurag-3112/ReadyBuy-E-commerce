import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

export const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        config.jwt.accessSecret,
        {
            expiresIn: "15m",
        }
    );
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        config.jwt.refreshSecret,
        {
            expiresIn: "7d",
        }
    );
};