CREATE TABLE "notification_email_pending" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"type" text NOT NULL,
	"actor_user_id" uuid,
	"object_type" text NOT NULL,
	"object_id" uuid NOT NULL,
	"project_id" uuid,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_notification_preferences" (
	"user_id" uuid PRIMARY KEY,
	"email_digest" text DEFAULT 'immediately' NOT NULL,
	"channels" jsonb DEFAULT '{}' NOT NULL,
	"email_digest_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_organization_notification_preferences" (
	"user_id" uuid,
	"organization_id" uuid,
	"muted_project_ids" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "user_organization_notification_preferences_pkey" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
CREATE INDEX "notification_email_pending_user_id_idx" ON "notification_email_pending" ("user_id");--> statement-breakpoint
ALTER TABLE "notification_email_pending" ADD CONSTRAINT "notification_email_pending_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "notification_email_pending" ADD CONSTRAINT "notification_email_pending_vxGPa4W8kTIX_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");--> statement-breakpoint
ALTER TABLE "notification_email_pending" ADD CONSTRAINT "notification_email_pending_actor_user_id_users_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "notification_email_pending" ADD CONSTRAINT "notification_email_pending_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "user_organization_notification_preferences" ADD CONSTRAINT "user_organization_notification_preferences_8TDOKfp9przB_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "user_organization_notification_preferences" ADD CONSTRAINT "user_organization_notification_preferences_voFQje60sgdh_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");