import { implement } from "@orpc/server";
import { findProjects } from "@workspace/server/modules/project/project.api";
import { projectContract } from "@workspace/server/modules/project/project.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(projectContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const projectRouter = os.router({
  findProjects: os.findProjects.handler(async ({ input }) => await findProjects(input)),
});
