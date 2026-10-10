import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { CreateBugReportType } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { randomUUID } from "crypto";

export abstract class BugReportFactory {
  static create(bugReport: CreateBugReportType): BugReport {
    const now = new Date();
    return new BugReport({
      id: randomUUID(),
      projectId: bugReport.projectId,
      assignedTo: null,
      status: BugReportStatus.NEW,
      severity: BugReportSeverity.MEDIUM,
      title: bugReport.title,
      description: bugReport.description,
      stepsToReproduce: null,
      reporterEmail: null,
      url: bugReport.url,
      userAgent: null,
      browser: null,
      os: null,
      device: null,
      viewportWidth: null,
      viewportHeight: null,
      screenshotKey: null,
      hasReplay: false,
      consoleLogs: null,
      networkLogs: null,
      customContext: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    });
  }
}
