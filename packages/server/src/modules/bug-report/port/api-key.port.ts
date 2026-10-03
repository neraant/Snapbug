import type {
  FindProjectByKeyInputDtoType,
  FindProjectByKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export type ApiKeyPort = {
  findProjectByKey: (input: FindProjectByKeyInputDtoType) => Promise<FindProjectByKeyOutputDtoType>;
};
