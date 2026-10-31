import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { UserPort } from "@workspace/server/modules/bug-report/port/user.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindOneInputDtoType,
  FindOneOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-one.schema";

export class FindOneUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(input: FindOneInputDtoType, userId: string): Promise<FindOneOutputDtoType> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const bugReport = await this.bugReportRepository.findByShortIdAndOrganizationId(
      input.shortId,
      membership.organizationId,
    );
    if (!bugReport) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    const assignee = bugReport.assignedTo
      ? ((await this.userPort.findManyByIds([bugReport.assignedTo]))[0] ?? null)
      : null;

    return BugReportMapper.toFindOneOutput(bugReport, assignee);
  }
}
