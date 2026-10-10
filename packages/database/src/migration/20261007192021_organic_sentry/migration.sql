CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL CONSTRAINT "invitation_token_unique" UNIQUE,
	"invited_by_user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "invitation_organization_email_unique" UNIQUE("organization_id","email")
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_user_id_users_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id");