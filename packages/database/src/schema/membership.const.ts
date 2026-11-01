import { organizationTable } from "@workspace/database/schema/organization.const";
import { userTable } from "@workspace/database/schema/user.const";
import { userRoles } from "@workspace/validation/modules/user/consts/user-role.const";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const membershipTable = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => userTable.id)
      .notNull(),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    role: text("role", { enum: userRoles }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [unique("membership_user_organization_unique").on(table.userId, table.organizationId)],
);
