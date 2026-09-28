export default {

    testEnvironment: "node",

    transform: {},

    verbose: true,

    testMatch: [

        "**/tests/**/*.test.js"

    ],

    setupFilesAfterEnv: [

        "<rootDir>/tests/setup/setup.js"

    ],

    collectCoverage: true,

    coverageDirectory: "coverage",

    collectCoverageFrom: [

        "src/**/*.js",

        "!src/server.js",

        "!src/config/**",

        "!src/swagger/**",

        "!src/seeds/**"

    ],

    testTimeout: 30000,

};