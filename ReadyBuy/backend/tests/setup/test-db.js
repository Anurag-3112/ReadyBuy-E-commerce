import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo;

export const connectTestDatabase =
    async () => {

        mongo =
            await MongoMemoryServer.create();

        const uri =
            mongo.getUri();

        await mongoose.connect(uri);

    };

export const clearDatabase =
    async () => {

        const collections =
            mongoose.connection.collections;

        for (const key in collections) {

            await collections[key].deleteMany();

        }

    };

export const disconnectDatabase =
    async () => {

        await mongoose.disconnect();

        if (mongo) {

            await mongo.stop();

        }

    };