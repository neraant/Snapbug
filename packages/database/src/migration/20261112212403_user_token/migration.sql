CREATE TABLE "user_tokens" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL CONSTRAINT "user_token_hash_unique" UNIQUE,
	"prefix" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "user_tokens_user_id_idx" ON "user_tokens" ("user_id");--> statement-breakpoint
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");