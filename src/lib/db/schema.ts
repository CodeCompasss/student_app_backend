import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  time: varchar("time", { length: 50 }),
  image: varchar("image", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
