import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { bugReportContract } from "@workspace/server/modules/bug-report/bug-report.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(bugReportContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const bugReportRouter = os.router({
  create: os.create.handler(
    async ({ input, context }) => await container.bugReport.createBugReport.execute(input, context.actor),
  ),
  findMany: authed.findMany.handler(
    async ({ input, context }) => await container.bugReport.findBugReports.execute(input, context.user.id),
  ),
  findStats: authed.findStats.handler(
    async ({ input, context }) => await container.bugReport.findStats.execute(input, context.user.id),
  ),
  findCharts: authed.findCharts.handler(
    async ({ input, context }) => await container.bugReport.findCharts.execute(input, context.user.id),
  ),
});
