import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, type Event } from "@/lib/db/schema";
import { processFileForStorage } from "@/lib/storage";
import { eq } from "drizzle-orm";


// Helper function to convert binary image to base64
function processEventImage(event: Event) {
  if (!event.imageData) return { ...event, imageData: null };
  
  const buffer = Buffer.isBuffer(event.imageData) 
    ? event.imageData 
    : Buffer.from(event.imageData as unknown as ArrayBuffer);
  
  const base64Image = buffer.toString('base64');
  return {
    ...event,
    imageData: `data:${event.imageMimeType};base64,${base64Image}`
  };
}

// GET one event
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db.select().from(events).where(eq(events.id, params.id));
    if (!result[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(processEventImage(result[0]));
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// Update event
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    
    // Get all form data
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const venue = formData.get("venue") as string | null;
    const date = formData.get("date") as string | null;
    const time = formData.get("time") as string | null;
    const imageFile = formData.get("image") as File | null;

    // Prepare update data
    const updateData: Partial<Event> = {
      updatedAt: new Date()
    };
    
    if (title) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (venue !== null) updateData.venue = venue;
    if (date) updateData.date = new Date(date);
    if (time !== null) updateData.time = time;

    // Handle image upload if provided
    if (imageFile) {
      try {
        const { buffer, mimeType } = await processFileForStorage(imageFile);
        updateData.imageData = buffer;
        updateData.imageMimeType = mimeType;
      } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json(
          { error: "Failed to process image" },
          { status: 400 }
        );
      }
    }

    const updated = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, params.id))
      .returning();

    if (!updated[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const responseData = processEventImage(updated[0]);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
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
