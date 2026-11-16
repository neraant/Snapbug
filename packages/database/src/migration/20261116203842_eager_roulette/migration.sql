ALTER TABLE "user_tokens" ADD COLUMN "scopes" text[];--> statement-breakpoint
UPDATE "user_tokens" SET "scopes" = ARRAY['tickets:read', 'tickets:write', 'comments:read', 'comments:write']::text[] WHERE "scopes" IS NULL;--> statement-breakpoint
ALTER TABLE "user_tokens" ALTER COLUMN "scopes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_tokens" ADD COLUMN "scope_preset" text;--> statement-breakpoint
UPDATE "user_tokens" SET "scope_preset" = 'fullAccess' WHERE "scope_preset" IS NULL;--> statement-breakpoint
ALTER TABLE "user_tokens" ADD COLUMN "project_ids" uuid[];