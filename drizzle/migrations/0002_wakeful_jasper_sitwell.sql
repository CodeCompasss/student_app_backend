ALTER TABLE "events" RENAME COLUMN "image" TO "image_data";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_mime_type" varchar(100);