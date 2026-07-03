import {
    getChannel,
} from "../../config/rabbitmq.js";

import {
    decrementStock,
} from "../../modules/products/product.repository.js";

export const startInventoryConsumer =
    async () => {

        const channel =
            getChannel();

        const exchange =
            "order.exchange";

        const queue =
            "inventory.queue";

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

                try {

                    const order =
                        JSON.parse(
                            msg.content.toString()
                        );

                    console.log(
                        `Processing order ${order._id}`
                    );

                    for (
                        const item of order.items
                    ) {

                        await decrementStock(
                            item.product,
                            item.quantity
                        );
                    }

                    channel.ack(msg);

                } catch (error) {

                    console.error(
                        error
                    );

                    channel.nack(
                        msg,
                        false,
                        true
                    );
                }
            }
        );
    };  