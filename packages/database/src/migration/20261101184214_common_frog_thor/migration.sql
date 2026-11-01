CREATE TABLE "project_accesses" (
	"id" uuid PRIMARY KEY,
	"membership_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_accesses" ADD CONSTRAINT "project_accesses_membership_id_memberships_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_accesses" ADD CONSTRAINT "project_accesses_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;--> statement-breakpoint
INSERT INTO "project_accesses" ("id", "membership_id", "project_id", "created_at")
SELECT gen_random_uuid(), "memberships"."id", "projects"."id", now()
FROM "memberships"
INNER JOIN "projects" ON "projects"."organization_id" = "memberships"."organization_id";
