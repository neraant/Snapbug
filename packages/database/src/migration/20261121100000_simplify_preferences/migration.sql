ALTER TABLE "user_preferences" DROP COLUMN "accent";
--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "density";
--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "date_format";
--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "use_24_hour_time";
--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "reduce_motion";
--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "default_landing_page";
--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "sidebar_collapsed";
--> statement-breakpoint
ALTER TABLE "user_notification_preferences" DROP COLUMN "email_digest";
--> statement-breakpoint
ALTER TABLE "user_notification_preferences" DROP COLUMN "email_digest_sent_at";
--> statement-breakpoint
DROP TABLE "notification_email_pending";