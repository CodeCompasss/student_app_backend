import { db } from "@/lib/db";
import { events, type Event } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { processFileForStorage } from "@/lib/storage";

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
      imageMimeType: mimeType // Ensure mimeType is included in the response
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return { ...event, imageData: null, imageMimeType: null };
  }
}

export async function GET() {
  try {
    const all = await db.select().from(events).orderBy(events.date);
    const eventsWithImages = all.map(processEventImage);
    
    return NextResponse.json(eventsWithImages);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const venue = formData.get("venue") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string | null;
    const imageFile = formData.get("image") as File | null;

    let imageBuffer: Buffer | null = null;
    let mimeType: string | null = null;

    // Process image if provided
    if (imageFile) {
      try {
        const { buffer, mimeType: fileMimeType } = await processFileForStorage(imageFile);
        imageBuffer = buffer;
        mimeType = fileMimeType;
      } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json(
          { error: "Failed to process image" },
          { status: 400 }
        );
      }
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const result = await db
      .insert(events)
      .values({
        slug,
        title,
        description,
        venue,
        date: new Date(date),
        time: time ?? null,
        imageData: imageBuffer,
        imageMimeType: mimeType,
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error('Failed to create event');
    }

    const created = result[0];
    if (!created) {
      throw new Error('Failed to create event');
    }

    const responseData = processEventImage(created as Event);
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
