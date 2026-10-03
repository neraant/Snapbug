import { apiKeyRouter } from "@workspace/server/modules/api-key/api-key.router";
import { authRouter } from "@workspace/server/modules/auth/auth.router";
import { bugReportRouter } from "@workspace/server/modules/bug-report/bug-report.router";
import { identityRouter } from "@workspace/server/modules/identity/identity.router";
import { membershipRouter } from "@workspace/server/modules/membership/membership.router";
import { projectRouter } from "@workspace/server/modules/project/project.router";

// @disabled flag
// import { flagRouter } from "@workspace/server/shared/flag/flag.router";

export const router = {
  apiKey: apiKeyRouter,
  auth: authRouter,
  bugReport: bugReportRouter,
  identity: identityRouter,
  membership: membershipRouter,
  project: projectRouter,
  // @disabled flag
  // flag: flagRouter,
};
export type AppRouter = typeof router;
