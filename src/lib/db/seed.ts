// src/lib/db/seed.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { events } from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log("🌱 Seeding database...");

  await db.insert(events).values([
    {
      slug: "techfest-2025",
      title: "TechFest 2025",
      description: "Annual college tech festival with coding, robotics, and more.",
      venue: "Main Auditorium",
      date: new Date("2025-10-15"),
      time: "10:00 AM",
    },
    {
      slug: "music-night",
      title: "Music Night",
      description: "An evening of live performances by local bands.",
      venue: "Open Grounds",
      date: new Date("2025-11-05"),
      time: "7:00 PM",
    },
  ]);

  console.log("✅ Seeding complete!");
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});
