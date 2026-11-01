import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export type ProjectPort = {
  findById: (id: string) => Promise<ProjectModelType | null>;
  findManyByOrganizationId: (input: FindProjectsInputDtoType) => Promise<FindProjectsOutputDtoType>;
};
