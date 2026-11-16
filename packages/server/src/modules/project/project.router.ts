import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { projectContract } from "@workspace/server/modules/project/project.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { adminMiddleware } from "@workspace/server/shared/orpc/require-role.middleware";

const os = implement(projectContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);
const admin = authed.use(adminMiddleware);

export const projectRouter = os.router({
  createProject: admin.createProject.handler(
    async ({ input, context }) => await container.project.createProject.execute(input, context.user.id),
  ),
  findProjects: authed.findProjects.handler(
    async ({ context }) => await container.project.findProjects.executeForUser(context.user.id, context.organizationId),
  ),
  listProjects: authed.listProjects.handler(
    async ({ context }) => await container.project.listProjects.execute(context.user.id),
  ),
  getProject: authed.getProject.handler(
    async ({ input, context }) => await container.project.getProject.execute(input, context.user.id),
  ),
  updateProject: admin.updateProject.handler(
    async ({ input, context }) => await container.project.updateProject.execute(input, context.user.id),
  ),
  archiveProject: admin.archiveProject.handler(
    async ({ input, context }) => await container.project.archiveProject.execute(input, context.user.id),
  ),
  restoreProject: admin.restoreProject.handler(
    async ({ input, context }) => await container.project.restoreProject.execute(input, context.user.id),
  ),
  deleteProject: admin.deleteProject.handler(
    async ({ input, context }) => await container.project.deleteProject.execute(input, context.user.id),
  ),
  findProjectWidgetSetting: authed.findProjectWidgetSetting.handler(
    async ({ input, context }) =>
      await container.project.findProjectWidgetSetting.execute(input, context.user.id, context.organizationId),
  ),
  updateProjectWidgetSetting: authed.updateProjectWidgetSetting.handler(
    async ({ input, context }) =>
      await container.project.updateProjectWidgetSetting.execute(input, context.user.id, context.organizationId),
  ),
});
