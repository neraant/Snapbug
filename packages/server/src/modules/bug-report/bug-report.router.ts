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
    async ({ input, context }) =>
      await container.bugReport.createBugReport.execute(input, context.actor, context.requestOrigin),
  ),
  findWidgetConfig: os.findWidgetConfig.handler(
    async ({ input, context }) => await container.bugReport.findWidgetConfig.execute(input, context.requestOrigin),
  ),
  findMany: authed.findMany.handler(
    async ({ input, context }) => await container.bugReport.findBugReports.execute(input, context.user.id),
  ),
  findOne: authed.findOne.handler(
    async ({ input, context }) => await container.bugReport.findOne.execute(input, context.user.id),
  ),
  findScreenshot: authed.findScreenshot.handler(async ({ input, context }) => {
    const screenshot = await container.bugReport.findScreenshot.execute(input, context.user.id);
    return new Blob([Buffer.from(screenshot.bytes)], { type: screenshot.contentType });
  }),
  findReplay: authed.findReplay.handler(async ({ input, context }) => {
    const replay = await container.bugReport.findReplay.execute(input, context.user.id);
    return new Blob([Buffer.from(replay.bytes)], { type: replay.contentType });
  }),
  update: authed.update.handler(
    async ({ input, context }) =>
      await container.bugReport.updateBugReport.execute(input, context.user.id, context.actor),
  ),
  findStats: authed.findStats.handler(
    async ({ input, context }) => await container.bugReport.findStats.execute(input, context.user.id),
  ),
  findCharts: authed.findCharts.handler(
    async ({ input, context }) => await container.bugReport.findCharts.execute(input, context.user.id),
  ),
  findBreakdowns: authed.findBreakdowns.handler(
    async ({ input, context }) => await container.bugReport.findBreakdowns.execute(input, context.user.id),
  ),
  findRecent: authed.findRecent.handler(
    async ({ input, context }) => await container.bugReport.findRecent.execute(input, context.user.id),
  ),
  findWorkload: authed.findWorkload.handler(
    async ({ input, context }) => await container.bugReport.findWorkload.execute(input, context.user.id),
  ),
});
