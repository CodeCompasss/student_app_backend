// src/lib/db/schema.ts
import { pgTable, text, varchar, timestamp, uuid, customType } from "drizzle-orm/pg-core";

// define bytea type manually
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  time: varchar("time", { length: 50 }),
  image: bytea("image"), // ✅ now works
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
