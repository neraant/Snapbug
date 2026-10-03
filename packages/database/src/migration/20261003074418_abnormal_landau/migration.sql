CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY,
	"project_id" uuid,
	"key" text NOT NULL CONSTRAINT "key_unique" UNIQUE,
	"created_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "bug_reports" (
	"id" uuid PRIMARY KEY,
	"project_id" uuid NOT NULL,
	"assigned_to" uuid,
	"status" text NOT NULL,
	"severity" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"steps_to_reproduce" text,
	"reporter_email" text,
	"url" text,
	"user_agent" text,
	"browser" text,
	"os" text,
	"device" text,
	"viewport_width" integer,
	"viewport_height" integer,
	"screenshot_key" text,
	"has_replay" boolean DEFAULT false NOT NULL,
	"console_logs" jsonb,
	"network_logs" jsonb,
	"custom_context" jsonb,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"organization_id" uuid,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id");--> statement-breakpoint
ALTER TABLE "bug_reports" ADD CONSTRAINT "bug_reports_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id");--> statement-breakpoint
ALTER TABLE "bug_reports" ADD CONSTRAINT "bug_reports_assigned_to_users_id_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");