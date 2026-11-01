import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";

export type ProjectPort = {
  withTx: (tx: unknown) => ProjectPort;
  findManyByOrganizationId: (input: FindProjectsInputDtoType) => Promise<FindProjectsOutputDtoType>;
};
