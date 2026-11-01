import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { UserPort } from "@workspace/server/modules/bug-report/port/user.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindRecentInputDtoType,
  FindRecentOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-recent.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

const recentBugReportLimit = 8;

export class FindRecentUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly userPort: UserPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(
    input: FindRecentInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindRecentOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.resolveProjects(input, membership);
    if (projects.length === 0) return [];

    const bugReports = await this.bugReportRepository.findRecentByProjectIds(
      projects.map((project) => project.id),
      recentBugReportLimit,
    );
    const recentBugReports = bugReports.slice(0, recentBugReportLimit);
    const users = await this.findAssignees(recentBugReports);

    const projectNameById = new Map(projects.map((project) => [project.id, project.name]));
    const userById = new Map(users.map((user) => [user.id, user]));

    return BugReportMapper.toRecentOutput(recentBugReports, projectNameById, userById);
  }

  private async resolveProjects(
    input: FindRecentInputDtoType,
    membership: MembershipModelType,
  ): Promise<ProjectModelType[]> {
    if (input.projectId) {
      const project = await this.projectPort.findById(input.projectId);
      if (!project || project.organizationId !== membership.organizationId) {
        throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      }
      const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [project.id]);
      if (allowedProjectIds.length === 0) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      return [project];
    }

    const projects = await this.projectPort.findManyByOrganizationId({ organizationId: membership.organizationId });
    const allowedProjectIds = new Set(
      await this.membershipPort.filterProjectIds(
        membership,
        projects.map((project) => project.id),
      ),
    );
    return projects.filter((project) => allowedProjectIds.has(project.id));
  }

  private async findAssignees(bugReports: BugReport[]): Promise<UserModelType[]> {
    const assigneeIds = [
      ...new Set(bugReports.flatMap((bugReport) => (bugReport.assignedTo ? [bugReport.assignedTo] : []))),
    ];
    if (assigneeIds.length === 0) return [];

    return await this.userPort.findManyByIds(assigneeIds);
  }
}
