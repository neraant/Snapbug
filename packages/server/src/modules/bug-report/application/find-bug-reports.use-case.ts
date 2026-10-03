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

export class FindBugReportsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(input: FindBugReportsInputDtoType, userId: string): Promise<FindBugReportsOutputDtoType> {
    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.projectPort.findManyByOrganizationId({ organizationId: input.organizationId });
    if (projects.length === 0) return [];

    const bugReports = await this.bugReportRepository.findManyByProjectIds(projects.map((project) => project.id));
    return bugReports.map((bugReport) => BugReportMapper.toDto(bugReport));
  }
}
