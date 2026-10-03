import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";

export async function findProjects(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
  const useCase = new FindProjectsUseCase(new ProjectRepository());
  return await useCase.execute(input);
}
