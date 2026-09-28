

import request from "../setup/server.js";

export const registerUser =
    async () => {

        const res =
            await request

                .post("/api/v1/auth/register")

                .send({

                    name: "Test User",

                    email: "test@test.com",

                    password: "Password123",

                });

        return res.body;

    };

export const loginUser =
    async () => {

        await registerUser();

        const res =
            await request

                .post("/api/v1/auth/login")

                .send({

                    email: "test@test.com",

                    password: "Password123",

                });

        return res.body;

    };

export const getToken =
    async () => {

        const login =
            await loginUser();

        return login.data.accessToken;

    };