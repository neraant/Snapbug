import { organizationTable } from "@workspace/database/schema/organization.const";
import { userTable } from "@workspace/database/schema/user.const";
import { UserRole, userRoles } from "@workspace/validation/modules/user/consts/user-role.const";
import { integer, jsonb, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const invitationTable = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    email: text("email").notNull(),
    tokenHash: text("token_hash").notNull(),
    tokenVersion: integer("token_version").notNull().default(1),
    invitedByUserId: uuid("invited_by_user_id")
      .references(() => userTable.id)
      .notNull(),
    role: text("role", { enum: userRoles }).notNull().default(UserRole.USER),
    projectIds: jsonb("project_ids").$type<string[]>().notNull().default([]),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: "date" }),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    unique("invitation_organization_email_unique").on(table.organizationId, table.email),
    unique("invitation_token_hash_unique").on(table.tokenHash),
  ],
);
