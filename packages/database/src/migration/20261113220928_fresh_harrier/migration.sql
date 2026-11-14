ALTER TABLE "audit_logs" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "source" text DEFAULT 'web';--> statement-breakpoint
UPDATE "audit_logs" AS audit_log
SET "organization_id" = project.organization_id
FROM "projects" AS project
WHERE audit_log.project_id = project.id;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "source" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "source" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "audit_logs_organization_occurred_at_idx" ON "audit_logs" ("organization_id","occurred_at");--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");
