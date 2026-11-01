import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { bugReportContract } from "@workspace/server/modules/bug-report/bug-report.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { adminMiddleware } from "@workspace/server/shared/orpc/require-role.middleware";

const os = implement(bugReportContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);
const admin = authed.use(adminMiddleware);

export const bugReportRouter = os.router({
  create: os.create.handler(
    async ({ input, context }) =>
      await container.bugReport.createBugReport.execute(input, context.actor, context.requestOrigin),
  ),
  findWidgetConfig: os.findWidgetConfig.handler(
    async ({ input, context }) => await container.bugReport.findWidgetConfig.execute(input, context.requestOrigin),
  ),
  findMany: authed.findMany.handler(
    async ({ input, context }) =>
      await container.bugReport.findBugReports.execute(input, context.user.id, context.organizationId),
  ),
  findOne: authed.findOne.handler(
    async ({ input, context }) =>
      await container.bugReport.findOne.execute(input, context.user.id, context.organizationId),
  ),
  findScreenshot: authed.findScreenshot.handler(async ({ input, context }) => {
    const screenshot = await container.bugReport.findScreenshot.execute(input, context.user.id, context.organizationId);
    return new Blob([Buffer.from(screenshot.bytes)], { type: screenshot.contentType });
  }),
  findReplay: authed.findReplay.handler(async ({ input, context }) => {
    const replay = await container.bugReport.findReplay.execute(input, context.user.id, context.organizationId);
    return new Blob([Buffer.from(replay.bytes)], { type: replay.contentType });
  }),
  update: authed.update.handler(
    async ({ input, context }) =>
      await container.bugReport.updateBugReport.execute(input, context.user.id, context.actor),
  ),
  findStats: authed.findStats.handler(
    async ({ input, context }) =>
      await container.bugReport.findStats.execute(input, context.user.id, context.organizationId),
  ),
  findCharts: authed.findCharts.handler(
    async ({ input, context }) =>
      await container.bugReport.findCharts.execute(input, context.user.id, context.organizationId),
  ),
  findBreakdowns: authed.findBreakdowns.handler(
    async ({ input, context }) =>
      await container.bugReport.findBreakdowns.execute(input, context.user.id, context.organizationId),
  ),
  findRecent: authed.findRecent.handler(
    async ({ input, context }) =>
      await container.bugReport.findRecent.execute(input, context.user.id, context.organizationId),
  ),
  findWorkload: authed.findWorkload.handler(
    async ({ input, context }) =>
      await container.bugReport.findWorkload.execute(input, context.user.id, context.organizationId),
  ),
  countOpenByProject: admin.countOpenByProject.handler(
    async ({ context }) =>
      await container.bugReport.countOpenByProject.execute(context.user.id, context.organizationId),
  ),
  countOpenByAssignee: admin.countOpenByAssignee.handler(
    async ({ context }) =>
      await container.bugReport.countOpenByAssignee.execute(context.user.id, context.organizationId),
  ),
});
