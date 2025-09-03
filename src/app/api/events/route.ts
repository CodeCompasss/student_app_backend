import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(events).orderBy(events.date);
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const data = await req.json();
  const slug = data.title.toLowerCase().replace(/\s+/g, "-");
  const created = await db.insert(events).values({ ...data, slug }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
