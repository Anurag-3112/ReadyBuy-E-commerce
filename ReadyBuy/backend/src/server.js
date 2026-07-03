import app from "./app.js";
import { config } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import logger from "./shared/logger/logger.js";

import { startInventoryConsumer, } from "./events/consumers/inventory.consumer.js";

const startServer = async () => {
    try {
        await connectDatabase();
        await connectRabbitMQ();

        await startInventoryConsumer();

        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });

        server.on("error", (error) => {
            logger.error(error);
            process.exit(1);
        });
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

startServer();