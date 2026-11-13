import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindBugReportsInputDtoType,
  FindBugReportsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";

export class ListTicketsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(input: FindBugReportsInputDtoType, userId: string): Promise<FindBugReportsOutputDtoType> {
    const memberships = await this.membershipPort.findManyByUser(userId);

    if (input.projectId) {
      const project = await this.projectPort.findById(input.projectId);
      if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

      const membership = memberships.find((item) => item.organizationId === project.organizationId);
      if (!membership) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

      const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [project.id]);
      if (allowedProjectIds.length === 0) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

      const bugReports = await this.bugReportRepository.findManyByProjectIds([project.id]);
      return BugReportMapper.toFindBugReportsOutput(bugReports);
    }

    const projectIds = new Set<string>();
    for (const membership of memberships) {
      const projects = await this.projectPort.findManyByOrganizationId({
        organizationId: membership.organizationId,
      });
      const allowedProjectIds = await this.membershipPort.filterProjectIds(
        membership,
        projects.map((project) => project.id),
      );
      for (const projectId of allowedProjectIds) {
        projectIds.add(projectId);
      }
    }

    if (projectIds.size === 0) return [];

    const bugReports = await this.bugReportRepository.findManyByProjectIds([...projectIds]);
    return BugReportMapper.toFindBugReportsOutput(bugReports);
  }
}
