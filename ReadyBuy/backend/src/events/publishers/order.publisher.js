import {
    getChannel,
} from "../../config/rabbitmq.js";

export const publishOrderCreated =
    async (order) => {

        const channel =
            getChannel();

        const exchange =
            "order.exchange";

        await channel.assertExchange(
            exchange,
            "fanout",
            {
                durable: true,
            }
        );

        channel.publish(
            exchange,
            "",
            Buffer.from(
                JSON.stringify({
                    orderId: order._id,
                    items: order.items,
                })
            )
        );
    };