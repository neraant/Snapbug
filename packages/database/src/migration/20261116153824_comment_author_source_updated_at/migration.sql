ALTER TABLE "comments" ADD COLUMN "author_source" text DEFAULT 'web' NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "updated_at" timestamp with time zone;