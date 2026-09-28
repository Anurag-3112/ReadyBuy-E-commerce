import { getChannel } from "../../config/rabbitmq.js";
import { decrementStock } from "../../modules/products/product.repository.js";
import {
    findInventoryEvent,
    createInventoryEvent,
    markInventoryCompleted,
    markInventoryFailed,
} from "../../modules/inventory/inventory-event.repository.js";

export const startInventoryConsumer = async () => {
    const channel = getChannel();
    const exchange = "order.exchange";
    const queue = "inventory.queue";

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

    channel.consume(queue, async (msg) => {
        if (!msg) {
            return;
        }

        let order;

        try {
            order = JSON.parse(
                msg.content.toString()
            );

            const orderId =
                order.orderId ||
                order._id;

            if (!orderId) {
                throw new Error(
                    "Inventory event missing orderId"
                );
            }

            console.log(
                `Processing inventory for order ${orderId}`
            );

            const existingEvent =
                await findInventoryEvent(
                    orderId
                );

            if (
                existingEvent?.status ===
                "COMPLETED"
            ) {
                console.log(
                    `Inventory already processed for order ${orderId}`
                );

                channel.ack(msg);

                return;
            }

            if (!existingEvent) {
                try {
                    await createInventoryEvent(
                        orderId
                    );
                } catch (error) {
                    const event =
                        await findInventoryEvent(
                            orderId
                        );

                    if (
                        event?.status ===
                        "COMPLETED"
                    ) {
                        channel.ack(msg);

                        return;
                    }
                }
            }

            for (const item of order.items) {
                const product =
                    await decrementStock(
                        item.product,
                        item.quantity
                    );

                if (!product) {
                    throw new Error(
                        `Insufficient stock for product ${item.product}`
                    );
                }
            }

            await markInventoryCompleted(
                orderId
            );

            console.log(
                `Inventory completed for order ${orderId}`
            );

            channel.ack(msg);
        } catch (error) {
            console.error(
                "Inventory processing failed:",
                error
            );

            if (order?.orderId || order?._id) {
                const orderId =
                    order.orderId ||
                    order._id;

                await markInventoryFailed(
                    orderId,
                    error
                );
            }

            channel.nack(
                msg,
                false,
                true
            );
        }
    });
};