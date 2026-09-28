import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (name) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value;
};

const config = {
    port: Number(
        process.env.PORT || 5001
    ),

    nodeEnv:
        process.env.NODE_ENV ||
        "development",

    mongo: {
        uri: requiredEnv(
            "MONGODB_URI"
        ),
    },

    redis: {
        url:
            process.env.REDIS_URL ||
            null,
    },

    rabbitmq: {
        url:
            process.env.RABBITMQ_URL ||
            null,
    },

    jwt: {
        accessSecret: requiredEnv(
            "JWT_ACCESS_SECRET"
        ),

        refreshSecret: requiredEnv(
            "JWT_REFRESH_SECRET"
        ),
    },

    cloudinary: {
        cloudName:
            process.env.CLOUDINARY_CLOUD_NAME,

        apiKey:
            process.env.CLOUDINARY_API_KEY,

        apiSecret:
            process.env.CLOUDINARY_API_SECRET,
    },

    razorpay: {
        keyId:
            process.env.RAZORPAY_KEY_ID,

        keySecret:
            process.env.RAZORPAY_KEY_SECRET,

        webhookSecret:
            process.env.RAZORPAY_WEBHOOK_SECRET,
    },
};

export default config;