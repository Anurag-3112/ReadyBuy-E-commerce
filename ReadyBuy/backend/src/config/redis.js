import Redis from "ioredis";
import { config } from "./env.js";

let redis = null;

if (config.redis.url) {
    redis = new Redis(config.redis.url);

    redis.on("connect", () => {
        console.log("Redis Connected");
    });

    redis.on("error", (err) => {
        console.error("Redis Error:", err.message);
    });
}

export default redis;