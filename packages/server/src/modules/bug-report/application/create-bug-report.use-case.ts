import { BugReportFactory } from "@workspace/server/modules/bug-report/entity/bug-report.factory";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateBugReportInputDtoType,
  CreateBugReportOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";

export class CreateBugReportUseCase {
  constructor(
    private readonly apiKeyPort: ApiKeyPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(input: CreateBugReportInputDtoType): Promise<CreateBugReportOutputDtoType> {
    const project = await this.apiKeyPort.findProjectByKey({ key: input.apiKey });
    if (!project) throw new UnauthorizedError(ERROR_CODES.INVALID_API_KEY);

    const bugReport = BugReportFactory.create({
      projectId: project.id,
      title: input.title,
      description: input.description,
      url: input.url,
    });
    await this.bugReportRepository.save(bugReport);
    return BugReportMapper.toDto(bugReport);
  }
}
