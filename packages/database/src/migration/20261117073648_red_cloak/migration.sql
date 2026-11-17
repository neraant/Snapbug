CREATE TABLE "user_preferences" (
	"user_id" uuid PRIMARY KEY,
	"time_zone" text DEFAULT 'UTC' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"accent" text DEFAULT '#F97316' NOT NULL,
	"density" text DEFAULT 'comfortable' NOT NULL,
	"date_format" text DEFAULT 'relative' NOT NULL,
	"use_24_hour_time" boolean DEFAULT true NOT NULL,
	"reduce_motion" boolean,
	"default_landing_page" text DEFAULT 'overview' NOT NULL,
	"sidebar_collapsed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");