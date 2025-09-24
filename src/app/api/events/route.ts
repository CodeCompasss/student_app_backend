import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(events).orderBy(events.date);
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const venue = formData.get("venue") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string | null;

  // image may or may not exist
  const imageFile = formData.get("image") as File | null;
  let imageBuffer: Buffer | null = null;

  if (imageFile) {
    const arrayBuffer = await imageFile.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const created = await db
    .insert(events)
    .values({
      slug,
      title,
      description,
      venue,
      date: new Date(date), // timestamp
      time: time ?? null,
      image: imageBuffer, // store blob
    })
    .returning();

  return NextResponse.json(created[0], { status: 201 });
}
