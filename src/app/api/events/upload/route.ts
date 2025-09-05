// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { bucket } from "@/lib/firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = `events/${uuidv4()}-${file.name}`;
  const fileRef = bucket.file(fileName);

  await fileRef.save(bytes, {
    contentType: file.type,
    public: true, // make it public
  });

  // Get public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return NextResponse.json({ url: publicUrl });
}
