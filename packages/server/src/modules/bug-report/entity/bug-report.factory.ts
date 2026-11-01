import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { CreateBugReportType } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { randomUUID } from "crypto";

export abstract class BugReportFactory {
  static create(bugReport: CreateBugReportType): BugReport {
    const now = new Date();
    const replayKey = bugReport.replayKey ?? null;
    return new BugReport({
      id: bugReport.id ?? randomUUID(),
      projectId: bugReport.projectId,
      shortId: bugReport.shortId,
      assignedTo: null,
      status: BugReportStatus.NEW,
      boardOrder: 0,
      severity: bugReport.severity ?? BugReportSeverity.MEDIUM,
      title: bugReport.title,
      description: bugReport.description,
      stepsToReproduce: null,
      reporterEmail: bugReport.reporterEmail ?? null,
      url: bugReport.url,
      userAgent: bugReport.userAgent ?? null,
      browser: bugReport.browser ?? null,
      os: bugReport.os ?? null,
      device: bugReport.device ?? null,
      viewportWidth: bugReport.viewportWidth ?? null,
      viewportHeight: bugReport.viewportHeight ?? null,
      screenshotKey: bugReport.screenshotKey ?? null,
      replayKey,
      hasReplay: replayKey !== null,
      consoleLogs: bugReport.consoleLogs ?? null,
      networkLogs: bugReport.networkLogs ?? null,
      customContext: bugReport.customContext ?? null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    });
  }
}
