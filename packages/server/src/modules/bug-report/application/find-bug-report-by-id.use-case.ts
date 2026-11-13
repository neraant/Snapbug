import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

export class FindBugReportByIdUseCase {
  constructor(private readonly bugReportRepository: BugReportRepository) {}

  async execute(id: string): Promise<BugReportModelType | null> {
    const bugReport = await this.bugReportRepository.findById(id);
    return bugReport ? BugReportMapper.toDto(bugReport) : null;
  }
}
