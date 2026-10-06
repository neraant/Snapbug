import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { UpdateProjectUseCase } from "@workspace/server/modules/project/application/update-project.use-case";
import { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type {
  CreateProjectInputDtoType,
  CreateProjectOutputDtoType,
} from "@workspace/validation/modules/project/dto/create-project.schema";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import type { UpdateProjectInputDtoType } from "@workspace/validation/modules/project/dto/update-project.schema";

export async function createProject(
  input: CreateProjectInputDtoType,
  userId: string,
): Promise<CreateProjectOutputDtoType> {
  const useCase = new CreateProjectUseCase(new MembershipAdapter(), new ProjectRepository());
  return await useCase.execute(input, userId);
}

export async function findProjects(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
  const useCase = new FindProjectsUseCase(new ProjectRepository());
  return await useCase.execute(input);
}

export async function updateProject(input: UpdateProjectInputDtoType, userId: string): Promise<ProjectModelType> {
  const useCase = new UpdateProjectUseCase(new MembershipAdapter(), new ProjectRepository());
  return await useCase.execute(input, userId);
}
