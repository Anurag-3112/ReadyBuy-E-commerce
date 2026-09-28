import InventoryEvent from "./inventory-event.model.js";


export const findInventoryEvent =
    (orderId) =>
        InventoryEvent.findOne({
            orderId,
        });


export const createInventoryEvent =
    (orderId) =>
        InventoryEvent.create({
            orderId,

            status:
                "PROCESSING",
        });


export const markInventoryCompleted =
    (orderId) =>
        InventoryEvent.findOneAndUpdate(
            {
                orderId,
            },

            {
                $set: {
                    status:
                        "COMPLETED",

                    processedAt:
                        new Date(),
                },
            },

            {
                new: true,
            }
        );


export const markInventoryFailed =
    (
        orderId,
        error
    ) =>
        InventoryEvent.findOneAndUpdate(
            {
                orderId,
            },

            {
                $set: {
                    status:
                        "FAILED",

                    error:
                        error?.message ||
                        "Inventory processing failed",
                },
            },

            {
                new: true,
            }
        );