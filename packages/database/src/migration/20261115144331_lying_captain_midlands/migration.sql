ALTER TABLE "bug_reports" ADD COLUMN "reporter_ip" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "default_assignee_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "store_visitor_ip" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "collect_visitor_email" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
UPDATE "projects"
SET "slug" = lower(regexp_replace(regexp_replace(trim("name"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE "slug" IS NULL;--> statement-breakpoint
UPDATE "projects"
SET "slug" = 'project'
WHERE "slug" IS NULL OR "slug" = '';--> statement-breakpoint
UPDATE "projects" AS p
SET "slug" = p."slug" || '-' || left(replace(p."id"::text, '-', ''), 8)
WHERE EXISTS (
  SELECT 1
  FROM "projects" AS other
  WHERE other."organization_id" = p."organization_id"
    AND other."slug" = p."slug"
    AND other."id" <> p."id"
);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_slug_unique" UNIQUE("organization_id","slug");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_default_assignee_id_users_id_fkey" FOREIGN KEY ("default_assignee_id") REFERENCES "users"("id") ON DELETE SET NULL;