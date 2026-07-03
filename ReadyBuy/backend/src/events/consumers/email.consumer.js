import {
    getChannel,
} from "../../config/rabbitmq.js";

export const startEmailConsumer =
    async () => {

        const channel =
            getChannel();

        const exchange =
            "order.exchange";

        const queue =
            "email.queue";

        await channel.assertExchange(
            exchange,
            "fanout",
            {
                durable: true,
            }
        );

        await channel.assertQueue(
            queue,
            {
                durable: true,
            }
        );

        await channel.bindQueue(
            queue,
            exchange,
            ""
        );

        channel.consume(
            queue,
            async (msg) => {

                const order =
                    JSON.parse(
                        msg.content.toString()
                    );

                console.log(
                    `Email sent for order ${order.orderId}`
                );

                channel.ack(msg);
            }
        );
    };