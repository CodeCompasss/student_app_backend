import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, type Event } from "@/lib/db/schema";
import { processFileForStorage } from "@/lib/storage";
import { eq } from "drizzle-orm";

// Disable body parsing since we're using form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to convert binary image to base64 data URL
function processEventImage(event: Event) {
  if (!event.imageData) return { ...event, imageData: null };
  
  try {
    const buffer = Buffer.isBuffer(event.imageData) 
      ? event.imageData 
      : Buffer.from(event.imageData as unknown as ArrayBuffer);
    
    const base64Image = buffer.toString('base64');
    const mimeType = event.imageMimeType || 'image/jpeg';
    
    return {
      ...event,
      imageData: `data:${mimeType};base64,${base64Image}`,
      imageMimeType: mimeType
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return { ...event, imageData: null, imageMimeType: null };
  }
}

type RouteParams = {
  params: {
    id: string;
  };
};

// GET one event
export async function GET(
  _: Request,
  { params }: RouteParams
) {
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

// PUT (update) event
export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const venue = formData.get('venue') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !venue || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData: Partial<Event> = {
      title,
      description,
      venue,
      date: new Date(date),
      time: time || null,
      updatedAt: new Date()
    };

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

    const result = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, params.id))
      .returning();

    if (!result[0]) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(processEventImage(result[0]));
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  try {
    await db.delete(events).where(eq(events.id, params.id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
