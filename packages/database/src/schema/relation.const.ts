import { membershipTable } from "@workspace/database/schema/membership.const";
import { organizationTable } from "@workspace/database/schema/organization.const";
import { userTable } from "@workspace/database/schema/user.const";
import { relations } from "drizzle-orm/_relations";

export const membershipRelations = relations(membershipTable, ({ one }) => ({
  user: one(userTable, {
    fields: [membershipTable.userId],
    references: [userTable.id],
  }),
  organization: one(organizationTable, {
    fields: [membershipTable.organizationId],
    references: [organizationTable.id],
  }),
}));

export const organizationRelations = relations(organizationTable, ({ many }) => ({
  memberships: many(membershipTable),
}));
