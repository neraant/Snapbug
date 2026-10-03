import { oc } from "@orpc/contract";
import {
  findProjectsInputDtoSchema,
  findProjectsOutputDtoSchema,
} from "@workspace/validation/modules/project/dto/find-projects.schema";

export const projectContract = {
  findProjects: oc
    .input(findProjectsInputDtoSchema)
    .output(findProjectsOutputDtoSchema)
    .route({ method: "GET", path: "/projects", tags: ["project"], summary: "List projects" }),
};
