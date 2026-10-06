import type { ProjectPort as ApiKeyProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ProjectPort as BugReportProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import type { ProjectPort as OrganizationProjectPort } from "@workspace/server/modules/organization/port/project.port";
import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
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

export class ProjectAdapter implements BugReportProjectPort, ApiKeyProjectPort, OrganizationProjectPort {
  constructor(private readonly projectRepository: ProjectRepository = new ProjectRepository()) {}

  async create(input: CreateProjectInputDtoType, userId: string): Promise<CreateProjectOutputDtoType> {
    return await new CreateProjectUseCase(new MembershipAdapter(), this.projectRepository).execute(input, userId);
  }

  async findById(id: string): Promise<ProjectModelType | null> {
    const project = await this.projectRepository.findById(id);
    return project ? ProjectMapper.toDto(project) : null;
  }

  async findManyByOrganizationId(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
    return await new FindProjectsUseCase(this.projectRepository).execute(input);
  }
}
