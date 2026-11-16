ALTER TABLE "invitations" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "project_ids" jsonb DEFAULT '[]' NOT NULL;