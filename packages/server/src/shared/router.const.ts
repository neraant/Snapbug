import { apiKeyRouter } from "@workspace/server/modules/api-key/api-key.router";
import { authRouter } from "@workspace/server/modules/auth/auth.router";
import { bugReportRouter } from "@workspace/server/modules/bug-report/bug-report.router";
import { identityRouter } from "@workspace/server/modules/identity/identity.router";
import { invitationRouter } from "@workspace/server/modules/invitation/invitation.router";
import { membershipRouter } from "@workspace/server/modules/membership/membership.router";
import { organizationRouter } from "@workspace/server/modules/organization/organization.router";
import { projectRouter } from "@workspace/server/modules/project/project.router";
import { userTokenRouter } from "@workspace/server/modules/user-token/user-token.router";

export const router = {
  apiKey: apiKeyRouter,
  auth: authRouter,
  bugReport: bugReportRouter,
  identity: identityRouter,
  invitation: invitationRouter,
  membership: membershipRouter,
  organization: organizationRouter,
  project: projectRouter,
  userToken: userTokenRouter,
};
export type AppRouter = typeof router;
