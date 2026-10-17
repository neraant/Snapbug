import type { DbClient } from "@workspace/database";
import type { ProjectPort as ApiKeyProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ProjectPort as BugReportProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { ProjectPort as OrganizationProjectPort } from "@workspace/server/modules/organization/port/project.port";
import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { FindProjectByIdUseCase } from "@workspace/server/modules/project/application/find-project-by-id.use-case";
import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type {
  CreateProjectInputDtoType,
  CreateProjectOutputDtoType,
} from "@workspace/validation/modules/project/dto/create-project.schema";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export class ProjectAdapter implements OrganizationProjectPort, BugReportProjectPort, ApiKeyProjectPort {
  private readonly createProject: CreateProjectUseCase;
  private readonly findProjects: FindProjectsUseCase;
  private readonly findProjectById: FindProjectByIdUseCase;

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly membershipPort: MembershipPort,
  ) {
    this.createProject = new CreateProjectUseCase(membershipPort, projectRepository);
    this.findProjects = new FindProjectsUseCase(membershipPort, projectRepository);
    this.findProjectById = new FindProjectByIdUseCase(projectRepository);
  }

  withTx(tx: unknown): ProjectAdapter {
    return new ProjectAdapter(this.projectRepository.withTx(tx as DbClient), this.membershipPort.withTx(tx));
  }

  async create(input: CreateProjectInputDtoType, userId: string): Promise<CreateProjectOutputDtoType> {
    return await this.createProject.execute(input, userId);
  }

  async findManyByOrganizationId(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
    return await this.findProjects.execute(input);
  }

  async findById(id: string): Promise<ProjectModelType | null> {
    return await this.findProjectById.execute(id);
  }

  async findWidgetSetting(projectId: string): Promise<ProjectWidgetSettingModelType | null> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) return null;
    return ProjectMapper.toWidgetSettingDto(project);
  }
}
