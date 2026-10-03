import { implement } from "@orpc/server";
import { findProjects } from "@workspace/server/modules/project/project.api";
import { projectContract } from "@workspace/server/modules/project/project.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(projectContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const projectRouter = os.router({
  findProjects: authed.findProjects.handler(async ({ input }) => await findProjects(input)),
});
