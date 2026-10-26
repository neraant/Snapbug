import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  UpdateBugReportInputDtoType,
  UpdateBugReportOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/update-bug-report.schema";

export class UpdateBugReportUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly bugReportService: BugReportService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: UpdateBugReportInputDtoType,
    userId: string,
    actor: AuditActor,
  ): Promise<UpdateBugReportOutputDtoType> {
    const bugReport = await this.bugReportRepository.findById(input.id);
    if (!bugReport) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    const project = await this.projectPort.findById(bugReport.projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: project.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const { id: _id, ...patch } = input;
    const updatedBugReport = bugReport.update(patch);

    if (updatedBugReport === bugReport) {
      return BugReportMapper.toDto(bugReport);
    }

    const shouldNormalizeBoardOrder = patch.boardOrder !== undefined || patch.status !== undefined;

    await this.withTransaction(async (tx) => {
      const bugReportService = this.bugReportService.withTx(tx).withActor(actor);
      await bugReportService.saveWithAudit(updatedBugReport, "Update bug report");

      if (shouldNormalizeBoardOrder) {
        await bugReportService.normalizeBoardOrder(updatedBugReport.projectId, updatedBugReport.status);
      }
    });

    const savedBugReport = await this.bugReportRepository.findById(updatedBugReport.id);
    if (!savedBugReport) {
      throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);
    }

    return BugReportMapper.toDto(savedBugReport);
  }
}
