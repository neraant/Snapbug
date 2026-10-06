import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { createProjectInputDtoSchema } from "@workspace/validation/modules/project/dto/create-project.schema";
import {
  findProjectsInputDtoSchema,
  findProjectsOutputDtoSchema,
} from "@workspace/validation/modules/project/dto/find-projects.schema";
import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { updateProjectInputDtoSchema } from "@workspace/validation/modules/project/dto/update-project.schema";

export const projectContract = {
  createProject: oc
    .input(createProjectInputDtoSchema)
    .output(projectModelSchema)
    .route({
      method: "POST",
      path: "/projects",
      tags: ["project"],
      summary: "Create project",
      spec: sessionAuthSpec,
    }),
  findProjects: oc
    .input(findProjectsInputDtoSchema)
    .output(findProjectsOutputDtoSchema)
    .route({ method: "GET", path: "/projects", tags: ["project"], summary: "List projects", spec: sessionAuthSpec }),
  updateProject: oc
    .input(updateProjectInputDtoSchema)
    .output(projectModelSchema)
    .route({
      method: "PATCH",
      path: "/projects",
      tags: ["project"],
      summary: "Update project",
      spec: sessionAuthSpec,
    }),
};
