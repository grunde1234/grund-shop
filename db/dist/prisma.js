"use strict";
exports.__esModule = true;
exports.prisma = void 0;
var serverless_1 = require("@neondatabase/serverless");
var adapter_neon_1 = require("@prisma/adapter-neon");
var prisma_1 = require("../src/generated/prisma");
var ws_1 = require("ws");
// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
serverless_1.neonConfig.webSocketConstructor = ws_1["default"];
var connectionString = "" + process.env.DATABASE_URL;
// Instantiates the Prisma adapter using the connection string to handle the connection between Prisma and Neon.
var adapter = new adapter_neon_1.PrismaNeon({ connectionString: connectionString });
// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
exports.prisma = new prisma_1.PrismaClient({ adapter: adapter }).$extends({
    result: {
        product: {
            price: {
                compute: function (product) {
                    return product.price.toString(); //conpute converts the decimal into strings before being taken as decimal and stored in DB
                }
            },
            rating: {
                compute: function (product) {
                    return product.rating.toString();
                }
            }
        }
    }
});
//this handles connection pooling for serverless environments
