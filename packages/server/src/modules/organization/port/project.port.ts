import type {
  CreateProjectInputDtoType,
  CreateProjectOutputDtoType,
} from "@workspace/validation/modules/project/dto/create-project.schema";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";

export type ProjectPort = {
  create: (input: CreateProjectInputDtoType, userId: string) => Promise<CreateProjectOutputDtoType>;
  findManyByOrganizationId: (input: FindProjectsInputDtoType) => Promise<FindProjectsOutputDtoType>;
};
