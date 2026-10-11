CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY,
	"action" text NOT NULL,
	"actor_type" text,
	"actor_id" uuid,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"changes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX "audit_logs_project_action_occurred_at_idx" ON "audit_logs" ("project_id","action","occurred_at");--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id");