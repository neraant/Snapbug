import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { UserPort } from "@workspace/server/modules/bug-report/port/user.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindWorkloadInputDtoType,
  FindWorkloadOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-workload.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class FindWorkloadUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly userPort: UserPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(input: FindWorkloadInputDtoType, userId: string): Promise<FindWorkloadOutputDtoType> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.resolveProjects(input, membership.organizationId);
    const members = await this.membershipPort.findManyByOrganizationId(membership.organizationId);
    const users = await this.findUsers(members);
    const openCountByAssignee = await this.openCountByAssignee(projects);

    return BugReportMapper.toWorkloadOutput(users, openCountByAssignee);
  }

  private async resolveProjects(input: FindWorkloadInputDtoType, organizationId: string): Promise<ProjectModelType[]> {
    if (input.projectId) {
      const project = await this.projectPort.findById(input.projectId);
      if (!project || project.organizationId !== organizationId) {
        throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      }
      return [project];
    }

    return await this.projectPort.findManyByOrganizationId({ organizationId });
  }

  private async findUsers(members: MembershipModelType[]): Promise<UserModelType[]> {
    const userIds = members.map((member) => member.userId);
    if (userIds.length === 0) return [];

    return await this.userPort.findManyByIds(userIds);
  }

  private async openCountByAssignee(projects: ProjectModelType[]): Promise<Map<string | null, number>> {
    if (projects.length === 0) return new Map();

    const rows = await this.bugReportRepository.countOpenByAssignee(projects.map((project) => project.id));
    return new Map(rows.map((row) => [row.assignedTo, row.count]));
  }
}
