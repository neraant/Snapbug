ALTER TABLE "user_tokens" ADD COLUMN "name" text;--> statement-breakpoint
UPDATE "user_tokens" SET "name" = "prefix" WHERE "name" IS NULL;--> statement-breakpoint
ALTER TABLE "user_tokens" ALTER COLUMN "name" SET NOT NULL;