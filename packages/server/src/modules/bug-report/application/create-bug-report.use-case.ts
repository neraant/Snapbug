import { BugReportFactory } from "@workspace/server/modules/bug-report/entity/bug-report.factory";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateBugReportInputDtoType,
  CreateBugReportOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";

export class CreateBugReportUseCase {
  constructor(
    private readonly apiKeyPort: ApiKeyPort,
    private readonly bugReportService: BugReportService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: CreateBugReportInputDtoType, actor: AuditActor | null): Promise<CreateBugReportOutputDtoType> {
    const project = await this.apiKeyPort.findProjectByKey({ key: input.apiKey });
    if (!project) throw new UnauthorizedError(ERROR_CODES.INVALID_API_KEY);

    const bugReport = BugReportFactory.create({
      projectId: project.id,
      title: input.title,
      description: input.description,
      url: input.url,
    });

    await this.withTransaction(async (tx) => {
      const bugReportService = this.bugReportService.withTx(tx).withActor(actor);
      await bugReportService.saveWithAudit(bugReport, "Create bug report");
    });

    return BugReportMapper.toDto(bugReport);
  }
}
