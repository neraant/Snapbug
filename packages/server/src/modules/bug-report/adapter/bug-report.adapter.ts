import type { DbClient } from "@workspace/database";
import { FindBugReportByIdUseCase } from "@workspace/server/modules/bug-report/application/find-bug-report-by-id.use-case";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

export class BugReportAdapter implements BugReportPort {
  private readonly findBugReportById: FindBugReportByIdUseCase;

  constructor(private readonly bugReportRepository: BugReportRepository) {
    this.findBugReportById = new FindBugReportByIdUseCase(bugReportRepository);
  }

  withTx(tx: unknown): BugReportAdapter {
    return new BugReportAdapter(this.bugReportRepository.withTx(tx as DbClient));
  }

  async findById(id: string): Promise<BugReportModelType | null> {
    return await this.findBugReportById.execute(id);
  }
}
