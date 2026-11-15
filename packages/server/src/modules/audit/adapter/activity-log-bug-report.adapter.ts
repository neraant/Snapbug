import type { DbClient } from "@workspace/database";
import type { AuditBugReportLinkType, BugReportPort } from "@workspace/server/modules/audit/port/bug-report.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";

export class ActivityLogBugReportAdapter implements BugReportPort {
  constructor(private readonly bugReportRepository: BugReportRepository) {}

  withTx(tx: unknown): ActivityLogBugReportAdapter {
    return new ActivityLogBugReportAdapter(this.bugReportRepository.withTx(tx as DbClient));
  }

  async findManyByIds(ids: string[]): Promise<AuditBugReportLinkType[]> {
    const bugReports = await this.bugReportRepository.findManyByIds(ids);
    return bugReports.map((bugReport) => ({
      id: bugReport.id,
      shortId: bugReport.shortId,
      projectId: bugReport.projectId,
    }));
  }
}
