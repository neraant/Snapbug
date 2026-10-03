import { implement } from "@orpc/server";
import { createBugReport, findBugReports } from "@workspace/server/modules/bug-report/bug-report.api";
import { bugReportContract } from "@workspace/server/modules/bug-report/bug-report.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(bugReportContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const bugReportRouter = os.router({
  create: os.create.handler(async ({ input }) => await createBugReport(input)),
  findMany: authed.findMany.handler(async ({ input, context }) => await findBugReports(input, context.user.id)),
});
