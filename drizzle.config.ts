import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load your env file explicitly
dotenv.config({ path: resolve(__dirname, ".env.local") });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql", // 👈 REQUIRED and must be a literal
  dbCredentials: {
    url: process.env.DATABASE_URL!, // 👈 Make sure this exists
  },
  strict: true,
  schemaFilter: ["public"], // optional, just to scope schema
} satisfies Config;
