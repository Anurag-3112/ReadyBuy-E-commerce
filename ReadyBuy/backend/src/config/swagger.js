import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "ReadyBuy API",

            version: "1.0.0",

            description:
                "Production-grade E-commerce Backend",
        },

        servers: [
            {
                url: "http://localhost:5001/api/v1",
            },
        ],
    },

    apis: [
        "./src/modules/**/*.js",
    ],
};

export const swaggerSpec =
    swaggerJsDoc(options);