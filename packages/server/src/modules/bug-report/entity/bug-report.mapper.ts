import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { BugReportPersistedType } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

export abstract class BugReportMapper {
  static fromPersistence(row: BugReportPersistedType): BugReport {
    return new BugReport(row);
  }

  static toPersistence(bugReport: BugReport): BugReportPersistedType {
    return bugReport.toObject();
  }

  static toAudit(bugReport: BugReport) {
    const row = bugReport.toObject();
    return {
      status: row.status,
      severity: row.severity,
      assignedTo: row.assignedTo,
      title: row.title,
      reporterEmail: row.reporterEmail,
      url: row.url,
      userAgent: row.userAgent,
      browser: row.browser,
      os: row.os,
      device: row.device,
      viewportWidth: row.viewportWidth,
      viewportHeight: row.viewportHeight,
      hasReplay: row.hasReplay,
      resolvedAt: row.resolvedAt,
    };
  }

  static toDto(bugReport: BugReport): BugReportModelType {
    const row = bugReport.toObject();
    return {
      id: row.id,
      projectId: row.projectId,
      assignedTo: row.assignedTo,
      status: row.status,
      severity: row.severity,
      title: row.title,
      description: row.description,
      stepsToReproduce: row.stepsToReproduce,
      reporterEmail: row.reporterEmail,
      url: row.url,
      userAgent: row.userAgent,
      browser: row.browser,
      os: row.os,
      device: row.device,
      viewportWidth: row.viewportWidth,
      viewportHeight: row.viewportHeight,
      hasReplay: row.hasReplay,
      consoleLogs: row.consoleLogs,
      networkLogs: row.networkLogs,
      customContext: row.customContext,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      resolvedAt: row.resolvedAt?.toISOString() ?? null,
    };
  }
}
