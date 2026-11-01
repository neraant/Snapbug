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

  async execute(
    input: FindOneInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindOneOutputDtoType> {
    const candidates = await this.bugReportRepository.findManyByShortId(input.shortId);
    const orderedCandidates = [...candidates].sort((left, right) => {
      if (left.organizationId === organizationId) return -1;
      if (right.organizationId === organizationId) return 1;
      return 0;
    });

    for (const candidate of orderedCandidates) {
      const membership = await this.membershipPort.findByUserAndOrganization({
        userId,
        organizationId: candidate.organizationId,
      });
      if (!membership) continue;

      const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [candidate.bugReport.projectId]);
      if (allowedProjectIds.length === 0) continue;

      const assignee = candidate.bugReport.assignedTo
        ? ((await this.userPort.findManyByIds([candidate.bugReport.assignedTo]))[0] ?? null)
        : null;

      return BugReportMapper.toFindOneOutput(candidate.bugReport, assignee, candidate.organizationId);
    }

    throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);
  }
}
