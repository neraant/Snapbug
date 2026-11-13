CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY,
	"bug_report_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "comments_bug_report_id_created_at_idx" ON "comments" ("bug_report_id","created_at");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_bug_report_id_bug_reports_id_fkey" FOREIGN KEY ("bug_report_id") REFERENCES "bug_reports"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_user_id_users_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id");