import { FindProjectByKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-by-key.use-case";
import { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import type {
  FindProjectByKeyInputDtoType,
  FindProjectByKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export async function findProjectByKey(input: FindProjectByKeyInputDtoType): Promise<FindProjectByKeyOutputDtoType> {
  const useCase = new FindProjectByKeyUseCase(new ApiKeyRepository(), new ProjectAdapter());
  return await useCase.execute(input);
}
