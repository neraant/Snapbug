import { apiKeyRouter } from "@workspace/server/modules/api-key/api-key.router";
import { auditRouter } from "@workspace/server/modules/audit/audit.router";
import { authRouter } from "@workspace/server/modules/auth/auth.router";
import { bugReportRouter } from "@workspace/server/modules/bug-report/bug-report.router";
import { commentRouter } from "@workspace/server/modules/comment/comment.router";
import { identityRouter } from "@workspace/server/modules/identity/identity.router";
import { invitationRouter } from "@workspace/server/modules/invitation/invitation.router";
import { mcpRouter } from "@workspace/server/modules/mcp/mcp.router";
import { membershipRouter } from "@workspace/server/modules/membership/membership.router";
import { notificationRouter } from "@workspace/server/modules/notification/notification.router";
import { organizationRouter } from "@workspace/server/modules/organization/organization.router";
import { preferenceRouter } from "@workspace/server/modules/preference/preference.router";
import { projectRouter } from "@workspace/server/modules/project/project.router";
import { searchRouter } from "@workspace/server/modules/search/search.router";
import { userTokenRouter } from "@workspace/server/modules/user-token/user-token.router";

export const router = {
  mcp: mcpRouter,
  apiKey: apiKeyRouter,
  audit: auditRouter,
  auth: authRouter,
  bugReport: bugReportRouter,
  comment: commentRouter,
  identity: identityRouter,
  invitation: invitationRouter,
  membership: membershipRouter,
  notification: notificationRouter,
  organization: organizationRouter,
  preference: preferenceRouter,
  project: projectRouter,
  search: searchRouter,
  userToken: userTokenRouter,
};
export type AppRouter = typeof router;
