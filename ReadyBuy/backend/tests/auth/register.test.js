import { describe, test, expect } from "@jest/globals";

import request from "../setup/server.js";

describe("Authentication - Register", () => {

    const validUser = {

        name: "John Doe",

        email: "john@example.com",

        password: "Password123",

    };

    test("should register a new user", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send(validUser);

        expect(res.statusCode).toBe(201);

        expect(res.body.success).toBe(true);

        expect(res.body.data).toBeDefined();

        expect(res.body.data.email).toBe(validUser.email);

    });

    test("should not allow duplicate email", async () => {

        await request
            .post("/api/v1/auth/register")
            .send(validUser);

        const res = await request
            .post("/api/v1/auth/register")
            .send(validUser);

        expect(res.statusCode).toBe(409);

        expect(res.body.success).toBe(false);

    });

    test("should reject empty name", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                name: "",

            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject empty email", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                email: "",

            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject empty password", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                password: "",

            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject invalid email", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                email: "invalid-email",

            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject password shorter than required", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                password: "123",

            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject request with missing body", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({});

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject null values", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                name: null,

                email: null,

                password: null,

            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should reject malformed JSON", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .set("Content-Type", "application/json")
            .send("invalid-json");

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should trim email", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                email: "   trim@example.com   ",

            });

        expect(res.statusCode).toBe(201);

    });

    test("response should not contain password", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                email: "new@example.com",

            });

        expect(res.body.data.password).toBeUndefined();

    });

    test("should return JSON", async () => {

        const res = await request
            .post("/api/v1/auth/register")
            .send({

                ...validUser,

                email: "json@example.com",

            });

        expect(res.headers["content-type"])
            .toContain("application/json");

    });

});