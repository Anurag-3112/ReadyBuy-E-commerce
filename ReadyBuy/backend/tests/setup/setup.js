import {

    beforeAll,

    afterAll,

    afterEach,

} from "@jest/globals";

import {

    connectTestDatabase,

    clearDatabase,

    disconnectDatabase,

} from "./test-db.js";

beforeAll(async () => {

    await connectTestDatabase();

});

afterEach(async () => {

    await clearDatabase();

});

afterAll(async () => {

    await disconnectDatabase();

});