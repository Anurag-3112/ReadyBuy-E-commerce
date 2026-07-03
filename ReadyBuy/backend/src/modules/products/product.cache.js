import redis from "../../config/redis.js";

const PRODUCT_CACHE_TTL = 300;

export const getCachedProducts = async (key) => {
    if (!redis) return null;

    const data = await redis.get(key);

    return data ? JSON.parse(data) : null;
};

export const setCachedProducts = async (key, data) => {
    if (!redis) return;

    await redis.set(
        key,
        JSON.stringify(data),
        "EX",
        PRODUCT_CACHE_TTL
    );
};

export const deleteCache = async (key) => {
    if (!redis) return;

    await redis.del(key);
};