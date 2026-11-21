import { organizationTable } from "@workspace/database/schema/organization.const";
import { userTable } from "@workspace/database/schema/user.const";
import { jsonb, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";

export const userOrganizationNotificationPreferenceTable = pgTable(
  "user_organization_notification_preferences",
  {
    userId: uuid("user_id")
      .references(() => userTable.id)
      .notNull(),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    mutedProjectIds: jsonb("muted_project_ids").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);
