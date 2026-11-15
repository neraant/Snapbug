import { DeleteProjectBugReportsUseCase } from "@workspace/server/modules/bug-report/application/delete-project-bug-reports.use-case";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportPort } from "@workspace/server/modules/project/port/bug-report.port";

export class ProjectBugReportAdapter implements BugReportPort {
  private readonly deleteProjectBugReports: DeleteProjectBugReportsUseCase;

  constructor(bugReportRepository: BugReportRepository, fileStoragePort: FileStoragePort) {
    this.deleteProjectBugReports = new DeleteProjectBugReportsUseCase(bugReportRepository, fileStoragePort);
  }

  async deleteProjectTicketsAndFiles(projectId: string): Promise<void> {
    await this.deleteProjectBugReports.execute(projectId);
  }
}
