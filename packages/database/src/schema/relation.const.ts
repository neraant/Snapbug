import { apiKeyTable } from "@workspace/database/schema/api-key.const";
import { bugReportTable } from "@workspace/database/schema/bug-report.const";
import { membershipTable } from "@workspace/database/schema/membership.const";
import { organizationTable } from "@workspace/database/schema/organization.const";
import { projectTable } from "@workspace/database/schema/project.const";
import { userTable } from "@workspace/database/schema/user.const";
import { relations } from "drizzle-orm/_relations";

export const userRelations = relations(userTable, ({ many }) => ({
  memberships: many(membershipTable),
  assignedBugReports: many(bugReportTable),
}));

export const organizationRelations = relations(organizationTable, ({ many }) => ({
  memberships: many(membershipTable),
  projects: many(projectTable),
}));

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

export const projectRelations = relations(projectTable, ({ one, many }) => ({
  organization: one(organizationTable, {
    fields: [projectTable.organizationId],
    references: [organizationTable.id],
  }),
  apiKeys: many(apiKeyTable),
  bugReports: many(bugReportTable),
}));

export const apiKeyRelations = relations(apiKeyTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [apiKeyTable.projectId],
    references: [projectTable.id],
  }),
}));

export const bugReportRelations = relations(bugReportTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [bugReportTable.projectId],
    references: [projectTable.id],
  }),
  assignee: one(userTable, {
    fields: [bugReportTable.assignedTo],
    references: [userTable.id],
  }),
}));
