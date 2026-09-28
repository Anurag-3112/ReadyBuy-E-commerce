import mongoose from "mongoose";


const inventoryEventSchema =
    new mongoose.Schema(
        {
            orderId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Order",

                required: true,

                unique: true,

                index: true,
            },

            status: {
                type: String,

                enum: [
                    "PROCESSING",
                    "COMPLETED",
                    "FAILED",
                ],

                default: "PROCESSING",
            },

            processedAt: {
                type: Date,
            },

            error: {
                type: String,

                trim: true,
            },
        },

        {
            timestamps: true,
        }
    );


export default mongoose.model(
    "InventoryEvent",
    inventoryEventSchema
);