import { apiKeyTable } from "@workspace/database/schema/api-key.const";
import { bugReportTable } from "@workspace/database/schema/bug-report.const";
import { membershipTable } from "@workspace/database/schema/membership.const";
import { organizationTable } from "@workspace/database/schema/organization.const";
import { projectTable } from "@workspace/database/schema/project.const";
import { resetPasswordTokenTable } from "@workspace/database/schema/reset-password-token.const";
import { userTable } from "@workspace/database/schema/user.const";
import { defineRelations } from "drizzle-orm";

const tables = {
  apiKeyTable,
  bugReportTable,
  membershipTable,
  organizationTable,
  projectTable,
  userTable,
  resetPasswordTokenTable,
};

export const relations = defineRelations(tables, (relation) => ({
  userTable: {
    memberships: relation.many.membershipTable(),
    assignedBugReports: relation.many.bugReportTable({
      from: relation.userTable.id,
      to: relation.bugReportTable.assignedTo,
    }),
    resetPasswordTokens: relation.many.resetPasswordTokenTable(),
  },
  resetPasswordTokenTable: {
    user: relation.one.userTable({
      from: relation.resetPasswordTokenTable.userId,
      to: relation.userTable.id,
      optional: false,
    }),
  },
  organizationTable: {
    memberships: relation.many.membershipTable(),
    projects: relation.many.projectTable(),
  },
  membershipTable: {
    user: relation.one.userTable({
      from: relation.membershipTable.userId,
      to: relation.userTable.id,
      optional: false,
    }),
    organization: relation.one.organizationTable({
      from: relation.membershipTable.organizationId,
      to: relation.organizationTable.id,
      optional: false,
    }),
  },
  projectTable: {
    organization: relation.one.organizationTable({
      from: relation.projectTable.organizationId,
      to: relation.organizationTable.id,
      optional: false,
    }),
    apiKeys: relation.many.apiKeyTable(),
    bugReports: relation.many.bugReportTable(),
  },
  apiKeyTable: {
    project: relation.one.projectTable({
      from: relation.apiKeyTable.projectId,
      to: relation.projectTable.id,
      optional: false,
    }),
  },
  bugReportTable: {
    project: relation.one.projectTable({
      from: relation.bugReportTable.projectId,
      to: relation.projectTable.id,
      optional: false,
    }),
    assignee: relation.one.userTable({
      from: relation.bugReportTable.assignedTo,
      to: relation.userTable.id,
    }),
  },
}));
