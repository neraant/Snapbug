import type { BugReportPersistedType } from "@workspace/server/modules/bug-report/entity/bug-report.types";

export class BugReport {
  readonly id: BugReportPersistedType["id"];
  readonly projectId: BugReportPersistedType["projectId"];
  readonly shortId: BugReportPersistedType["shortId"];
  readonly assignedTo: BugReportPersistedType["assignedTo"];
  readonly status: BugReportPersistedType["status"];
  readonly severity: BugReportPersistedType["severity"];
  readonly title: BugReportPersistedType["title"];
  readonly description: BugReportPersistedType["description"];
  readonly stepsToReproduce: BugReportPersistedType["stepsToReproduce"];
  readonly reporterEmail: BugReportPersistedType["reporterEmail"];
  readonly url: BugReportPersistedType["url"];
  readonly userAgent: BugReportPersistedType["userAgent"];
  readonly browser: BugReportPersistedType["browser"];
  readonly os: BugReportPersistedType["os"];
  readonly device: BugReportPersistedType["device"];
  readonly viewportWidth: BugReportPersistedType["viewportWidth"];
  readonly viewportHeight: BugReportPersistedType["viewportHeight"];
  readonly screenshotKey: BugReportPersistedType["screenshotKey"];
  readonly hasReplay: BugReportPersistedType["hasReplay"];
  readonly consoleLogs: BugReportPersistedType["consoleLogs"];
  readonly networkLogs: BugReportPersistedType["networkLogs"];
  readonly customContext: BugReportPersistedType["customContext"];
  readonly createdAt: BugReportPersistedType["createdAt"];
  readonly updatedAt: BugReportPersistedType["updatedAt"];
  readonly resolvedAt: BugReportPersistedType["resolvedAt"];

  constructor(bugReport: BugReportPersistedType) {
    this.id = bugReport.id;
    this.projectId = bugReport.projectId;
    this.shortId = bugReport.shortId;
    this.assignedTo = bugReport.assignedTo;
    this.status = bugReport.status;
    this.severity = bugReport.severity;
    this.title = bugReport.title;
    this.description = bugReport.description;
    this.stepsToReproduce = bugReport.stepsToReproduce;
    this.reporterEmail = bugReport.reporterEmail;
    this.url = bugReport.url;
    this.userAgent = bugReport.userAgent;
    this.browser = bugReport.browser;
    this.os = bugReport.os;
    this.device = bugReport.device;
    this.viewportWidth = bugReport.viewportWidth;
    this.viewportHeight = bugReport.viewportHeight;
    this.screenshotKey = bugReport.screenshotKey;
    this.hasReplay = bugReport.hasReplay;
    this.consoleLogs = bugReport.consoleLogs;
    this.networkLogs = bugReport.networkLogs;
    this.customContext = bugReport.customContext;
    this.createdAt = bugReport.createdAt;
    this.updatedAt = bugReport.updatedAt;
    this.resolvedAt = bugReport.resolvedAt;
  }

  toObject(): BugReportPersistedType {
    return {
      id: this.id,
      projectId: this.projectId,
      shortId: this.shortId,
      assignedTo: this.assignedTo,
      status: this.status,
      severity: this.severity,
      title: this.title,
      description: this.description,
      stepsToReproduce: this.stepsToReproduce,
      reporterEmail: this.reporterEmail,
      url: this.url,
      userAgent: this.userAgent,
      browser: this.browser,
      os: this.os,
      device: this.device,
      viewportWidth: this.viewportWidth,
      viewportHeight: this.viewportHeight,
      screenshotKey: this.screenshotKey,
      hasReplay: this.hasReplay,
      consoleLogs: this.consoleLogs,
      networkLogs: this.networkLogs,
      customContext: this.customContext,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
    };
  }
}
