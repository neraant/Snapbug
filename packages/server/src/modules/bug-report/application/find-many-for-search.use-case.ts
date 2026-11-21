import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportSearchRowType } from "@workspace/server/modules/search/port/bug-report.port";

export class FindManyForSearchUseCase {
  constructor(private readonly bugReportRepository: BugReportRepository) {}

  async execute(projectIds: string[], query: string, limit: number): Promise<BugReportSearchRowType[]> {
    if (projectIds.length === 0) {
      return [];
    }

    const bugReports = await this.bugReportRepository.findManyByProjectIdsMatchingQuery(projectIds, query, limit);
    return bugReports.map((bugReport) => {
      const row = bugReport.toObject();
      return {
        id: row.id,
        shortId: row.shortId,
        title: row.title,
        projectId: row.projectId,
        status: row.status,
        severity: row.severity,
      };
    });
  }
}
