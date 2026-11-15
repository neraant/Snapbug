import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";

export class DeleteProjectBugReportsUseCase {
  constructor(
    private readonly bugReportRepository: BugReportRepository,
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(projectId: string): Promise<void> {
    const bugReports = await this.bugReportRepository.findManyByProjectIds([projectId]);

    await Promise.all(
      bugReports.flatMap((bugReport) => {
        const deletions: Promise<void>[] = [];
        if (bugReport.screenshotKey) {
          deletions.push(this.fileStoragePort.delete(bugReport.screenshotKey).catch(() => undefined) as Promise<void>);
        }
        if (bugReport.replayKey) {
          deletions.push(this.fileStoragePort.delete(bugReport.replayKey).catch(() => undefined) as Promise<void>);
        }
        return deletions;
      }),
    );

    await this.bugReportRepository.deleteManyByProjectId(projectId);
  }
}
