import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { projectContract } from "@workspace/server/modules/project/project.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(projectContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const projectRouter = os.router({
  createProject: authed.createProject.handler(
    async ({ input, context }) => await container.project.createProject.execute(input, context.user.id),
  ),
  findProjects: authed.findProjects.handler(
    async ({ context }) => await container.project.findProjects.executeForUser(context.user.id),
  ),
  updateProject: authed.updateProject.handler(
    async ({ input, context }) => await container.project.updateProject.execute(input, context.user.id),
  ),
  findProjectWidgetSetting: authed.findProjectWidgetSetting.handler(
    async ({ input, context }) => await container.project.findProjectWidgetSetting.execute(input, context.user.id),
  ),
  updateProjectWidgetSetting: authed.updateProjectWidgetSetting.handler(
    async ({ input, context }) => await container.project.updateProjectWidgetSetting.execute(input, context.user.id),
  ),
});
