import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "PORT",
    "MONGODB_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const config = {
    port: process.env.PORT,

    mongo: {
        uri: process.env.MONGODB_URI,
    },

    redis: {
        url: process.env.REDIS_URL,
    },

    rabbitmq: {
        url:
            process.env.RABBITMQ_URL,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
    },

    cloudinary: {

        cloudName:
            process.env.CLOUDINARY_CLOUD_NAME,

        apiKey:
            process.env.CLOUDINARY_API_KEY,

        apiSecret:
            process.env.CLOUDINARY_API_SECRET,

    },

    nodeEnv: process.env.NODE_ENV || "development",
};