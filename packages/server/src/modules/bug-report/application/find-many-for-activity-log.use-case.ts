import type { AuditBugReportLinkType } from "@workspace/server/modules/audit/port/bug-report.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";

export class FindManyBugReportsForActivityLogUseCase {
  constructor(private readonly bugReportRepository: BugReportRepository) {}

  async execute(ids: string[]): Promise<AuditBugReportLinkType[]> {
    if (ids.length === 0) return [];

    const bugReports = await this.bugReportRepository.findManyByIds(ids);
    return bugReports.map((bugReport) => {
      const row = bugReport.toObject();
      return {
        id: row.id,
        shortId: row.shortId,
        projectId: row.projectId,
      };
    });
  }
}
