import { defineConfig, env } from "prisma/config";
// Optional: import dotenv/config to load environment variables automatically
import "dotenv/config"; 

export default defineConfig({
  schema: "./prisma/schema.prisma", // Specify the path to your schema file
  migrations: {
    path: "prisma/migrations", // Specify the path for migrations
    // seed: "tsx prisma/seed.ts", // Optional: specify the seed command
  },
  datasource: {
    url: env("DATABASE_URL"), // Use the env helper to access environment variables
  },
});
