"use strict";
exports.__esModule = true;
var config_1 = require("prisma/config");
// Optional: import dotenv/config to load environment variables automatically
require("dotenv/config");
exports["default"] = config_1.defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations"
    },
    datasource: {
        url: config_1.env("DATABASE_URL")
    }
});
