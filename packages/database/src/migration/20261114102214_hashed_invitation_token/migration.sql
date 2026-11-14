CREATE EXTENSION IF NOT EXISTS pgcrypto;--> statement-breakpoint
ALTER TABLE "invitations" RENAME COLUMN "token" TO "token_hash";--> statement-breakpoint
UPDATE "invitations" SET "token_hash" = encode(digest(convert_to("token_hash", 'UTF8'), 'sha256'), 'hex');--> statement-breakpoint
ALTER TABLE "invitations" RENAME CONSTRAINT "invitation_token_unique" TO "invitation_token_hash_unique";