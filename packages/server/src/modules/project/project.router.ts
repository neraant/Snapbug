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
  findProjects: authed.findProjects.handler(async ({ input }) => await container.project.findProjects.execute(input)),
  updateProject: authed.updateProject.handler(
    async ({ input, context }) => await container.project.updateProject.execute(input, context.user.id),
  ),
});
