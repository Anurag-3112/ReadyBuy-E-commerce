import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";
import AppError from "../errors/AppError.js";

const authenticate = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            throw new AppError(
                "Unauthorized",
                401
            );
        }

        const token =
            authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            config.jwt.accessSecret
        );

        req.user = decoded;

        next();
    } catch (error) {
        next(
            new AppError(
                "Invalid or expired token",
                401
            )
        );
    }
};

export default authenticate;