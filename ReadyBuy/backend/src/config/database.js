import mongoose from "mongoose";
import { config } from "./env.js";
import logger from "../shared/logger/logger.js";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(config.mongo.uri);

        logger.info("MongoDB Connected Successfully");
    } catch (error) {
        logger.error(`MongoDB Connection Failed: ${error.message}`);

        process.exit(1);
    }
};