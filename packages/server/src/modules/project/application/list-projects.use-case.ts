import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import type { FindProjectsOutputDtoType } from "@workspace/validation/modules/project/dto/find-projects.schema";

export class ListProjectsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string): Promise<FindProjectsOutputDtoType> {
    const memberships = await this.membershipPort.findManyByUser(userId);
    const projects = await this.collectProjects(memberships);
    const uniqueById = new Map(projects.map((project) => [project.id, project]));
    return [...uniqueById.values()].map((project) => ProjectMapper.toDto(project));
  }

  private async collectProjects(memberships: MembershipModelType[]) {
    const projects = [];
    for (const membership of memberships) {
      const organizationProjects = await this.projectRepository.findManyByOrganizationId(membership.organizationId);
      const allowedProjectIds = new Set(
        await this.membershipPort.filterProjectIds(
          membership,
          organizationProjects.map((project) => project.id),
        ),
      );
      projects.push(...organizationProjects.filter((project) => allowedProjectIds.has(project.id)));
    }
    return projects;
  }
}
