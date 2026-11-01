import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { CountOpenByAssigneeOutputDtoType } from "@workspace/validation/modules/bug-report/dto/count-open-by-assignee.schema";

export class CountOpenByAssigneeUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<CountOpenByAssigneeOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.projectPort.findManyByOrganizationId({
      organizationId: membership.organizationId,
    });
    const projectIds = await this.membershipPort.filterProjectIds(
      membership,
      projects.map((project) => project.id),
    );
    const rows = await this.bugReportRepository.countOpenByAssignee(projectIds);

    return BugReportMapper.toCountOpenByAssigneeOutput(rows);
  }
}
