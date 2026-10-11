ALTER TABLE "bug_reports" ADD COLUMN "short_id" text;--> statement-breakpoint
WITH numbered AS (
	SELECT
		bug_report."id",
		'SNB-' || row_number() OVER (
			PARTITION BY project."organization_id"
			ORDER BY bug_report."created_at", bug_report."id"
		)::text AS "short_id"
	FROM "bug_reports" AS bug_report
	INNER JOIN "projects" AS project ON bug_report."project_id" = project."id"
)
UPDATE "bug_reports" AS bug_report
SET "short_id" = numbered."short_id"
FROM numbered
WHERE bug_report."id" = numbered."id";
--> statement-breakpoint
ALTER TABLE "bug_reports" ALTER COLUMN "short_id" SET NOT NULL;
