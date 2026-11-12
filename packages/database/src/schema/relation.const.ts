import { apiKeyTable } from "@workspace/database/schema/api-key.const";
import { bugReportTable } from "@workspace/database/schema/bug-report.const";
import { invitationTable } from "@workspace/database/schema/invitation.const";
import { membershipTable } from "@workspace/database/schema/membership.const";
import { organizationTable } from "@workspace/database/schema/organization.const";
import { projectTable } from "@workspace/database/schema/project.const";
import { projectAccessTable } from "@workspace/database/schema/project-access.const";
import { resetPasswordTokenTable } from "@workspace/database/schema/reset-password-token.const";
import { userTable } from "@workspace/database/schema/user.const";
import { userTokenTable } from "@workspace/database/schema/user-token.const";
import { defineRelations } from "drizzle-orm";

const tables = {
  apiKeyTable,
  bugReportTable,
  invitationTable,
  membershipTable,
  organizationTable,
  projectAccessTable,
  projectTable,
  userTable,
  resetPasswordTokenTable,
  userTokenTable,
};

export const relations = defineRelations(tables, (relation) => ({
  userTable: {
    memberships: relation.many.membershipTable(),
    assignedBugReports: relation.many.bugReportTable({
      from: relation.userTable.id,
      to: relation.bugReportTable.assignedTo,
    }),
    resetPasswordTokens: relation.many.resetPasswordTokenTable(),
    userTokens: relation.many.userTokenTable(),
    sentInvitations: relation.many.invitationTable({
      from: relation.userTable.id,
      to: relation.invitationTable.invitedByUserId,
    }),
  },
  invitationTable: {
    organization: relation.one.organizationTable({
      from: relation.invitationTable.organizationId,
      to: relation.organizationTable.id,
      optional: false,
    }),
    invitedBy: relation.one.userTable({
      from: relation.invitationTable.invitedByUserId,
      to: relation.userTable.id,
      optional: false,
    }),
  },
  organizationTable: {
    memberships: relation.many.membershipTable(),
    projects: relation.many.projectTable(),
    invitations: relation.many.invitationTable(),
  },
  resetPasswordTokenTable: {
    user: relation.one.userTable({
      from: relation.resetPasswordTokenTable.userId,
      to: relation.userTable.id,
      optional: false,
    }),
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
    projectAccesses: relation.many.projectAccessTable(),
  },
  projectAccessTable: {
    membership: relation.one.membershipTable({
      from: relation.projectAccessTable.membershipId,
      to: relation.membershipTable.id,
      optional: false,
    }),
    project: relation.one.projectTable({
      from: relation.projectAccessTable.projectId,
      to: relation.projectTable.id,
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
    projectAccesses: relation.many.projectAccessTable(),
  },
  apiKeyTable: {
    project: relation.one.projectTable({
      from: relation.apiKeyTable.projectId,
      to: relation.projectTable.id,
      optional: false,
    }),
  },
  userTokenTable: {
    user: relation.one.userTable({
      from: relation.userTokenTable.userId,
      to: relation.userTable.id,
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
