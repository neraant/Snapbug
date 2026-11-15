import type { DbClient } from "@workspace/database";
import type { AuditBugReportLinkType, BugReportPort } from "@workspace/server/modules/audit/port/bug-report.port";
import { FindManyBugReportsForActivityLogUseCase } from "@workspace/server/modules/bug-report/application/find-many-for-activity-log.use-case";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";

export class ActivityLogBugReportAdapter implements BugReportPort {
  private readonly findManyForActivityLog: FindManyBugReportsForActivityLogUseCase;

  constructor(private readonly bugReportRepository: BugReportRepository) {
    this.findManyForActivityLog = new FindManyBugReportsForActivityLogUseCase(bugReportRepository);
  }

  withTx(tx: unknown): ActivityLogBugReportAdapter {
    return new ActivityLogBugReportAdapter(this.bugReportRepository.withTx(tx as DbClient));
  }

  async findManyByIds(ids: string[]): Promise<AuditBugReportLinkType[]> {
    return await this.findManyForActivityLog.execute(ids);
  }
}
