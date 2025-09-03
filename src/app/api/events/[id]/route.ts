import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Update event
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await db
    .update(events)
    .set(data)
    .where(eq(events.id, params.id))
    .returning();

  if (!updated[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

// Delete event
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const deleted = await db
    .delete(events)
    .where(eq(events.id, params.id))
    .returning();

  if (!deleted[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
