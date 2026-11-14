import { organizationTable } from "@workspace/database/schema/organization.const";
import { userTable } from "@workspace/database/schema/user.const";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const invitationTable = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    email: text("email").notNull(),
    tokenHash: text("token_hash").notNull(),
    invitedByUserId: uuid("invited_by_user_id")
      .references(() => userTable.id)
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    unique("invitation_organization_email_unique").on(table.organizationId, table.email),
    unique("invitation_token_hash_unique").on(table.tokenHash),
  ],
);
