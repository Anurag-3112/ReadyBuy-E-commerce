import amqp from "amqplib";
import { config } from "./env.js";

let channel;

export const connectRabbitMQ = async () => {
    while (true) {
        try {
            const connection = await amqp.connect(config.rabbitmq.url);

            channel = await connection.createChannel();

            console.log("RabbitMQ Connected");

            return;
        } catch (err) {
            console.log(
                "RabbitMQ not ready. Retrying in 5 seconds..."
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 5001)
            );
        }
    }
};

export const getChannel = () => channel;