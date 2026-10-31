import type {
  BugReportPersistedType,
  UpdateBugReportType,
} from "@workspace/server/modules/bug-report/entity/bug-report.types";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

const updateBugReportFieldKeys = [
  "assignedTo",
  "status",
  "boardOrder",
  "severity",
  "title",
  "description",
  "stepsToReproduce",
  "reporterEmail",
  "url",
  "userAgent",
  "browser",
  "os",
  "device",
  "viewportWidth",
  "viewportHeight",
  "consoleLogs",
  "networkLogs",
  "customContext",
] as const satisfies readonly (keyof UpdateBugReportType)[];

export class BugReport {
  readonly id: BugReportPersistedType["id"];
  readonly projectId: BugReportPersistedType["projectId"];
  readonly shortId: BugReportPersistedType["shortId"];
  readonly assignedTo: BugReportPersistedType["assignedTo"];
  readonly status: BugReportPersistedType["status"];
  readonly boardOrder: BugReportPersistedType["boardOrder"];
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
  readonly replayKey: BugReportPersistedType["replayKey"];
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
    this.boardOrder = bugReport.boardOrder;
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
    this.replayKey = bugReport.replayKey;
    this.hasReplay = bugReport.hasReplay;
    this.consoleLogs = bugReport.consoleLogs;
    this.networkLogs = bugReport.networkLogs;
    this.customContext = bugReport.customContext;
    this.createdAt = bugReport.createdAt;
    this.updatedAt = bugReport.updatedAt;
    this.resolvedAt = bugReport.resolvedAt;
  }

  update(patch: UpdateBugReportType): BugReport {
    const definedPatch = BugReport.toDefinedPatch(patch);
    const now = new Date();
    const nextStatus = definedPatch.status ?? this.status;
    let resolvedAt = this.resolvedAt;

    if (definedPatch.status !== undefined) {
      const isClosedStatus =
        definedPatch.status === BugReportStatus.RESOLVED || definedPatch.status === BugReportStatus.CLOSED;
      const isOpenStatus =
        definedPatch.status === BugReportStatus.NEW || definedPatch.status === BugReportStatus.IN_PROGRESS;

      if (isOpenStatus) {
        resolvedAt = null;
      } else if (isClosedStatus && resolvedAt === null) {
        resolvedAt = now;
      }
    }

    const next: BugReportPersistedType = {
      ...this.toObject(),
      ...definedPatch,
      status: nextStatus,
      resolvedAt,
      id: this.id,
      projectId: this.projectId,
      shortId: this.shortId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    if (!this.hasPersistedChanges(next)) {
      return this;
    }

    return new BugReport({
      ...next,
      updatedAt: now,
    });
  }

  toObject(): BugReportPersistedType {
    return {
      id: this.id,
      projectId: this.projectId,
      shortId: this.shortId,
      assignedTo: this.assignedTo,
      status: this.status,
      boardOrder: this.boardOrder,
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
      replayKey: this.replayKey,
      hasReplay: this.hasReplay,
      consoleLogs: this.consoleLogs,
      networkLogs: this.networkLogs,
      customContext: this.customContext,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
    };
  }

  private hasPersistedChanges(next: BugReportPersistedType): boolean {
    const current = this.toObject();

    for (const key of Object.keys(current) as (keyof BugReportPersistedType)[]) {
      if (key === "updatedAt") {
        continue;
      }

      if (!BugReport.valuesEqual(current[key], next[key])) {
        return true;
      }
    }

    return false;
  }

  private static toDefinedPatch(patch: UpdateBugReportType): UpdateBugReportType {
    return Object.fromEntries(
      updateBugReportFieldKeys.filter((key) => patch[key] !== undefined).map((key) => [key, patch[key]]),
    ) as UpdateBugReportType;
  }

  private static valuesEqual(left: unknown, right: unknown): boolean {
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() === right.getTime();
    }

    if (Array.isArray(left) && Array.isArray(right)) {
      return JSON.stringify(left) === JSON.stringify(right);
    }

    if (
      left !== null &&
      typeof left === "object" &&
      right !== null &&
      typeof right === "object" &&
      !(left instanceof Date) &&
      !(right instanceof Date)
    ) {
      return JSON.stringify(left) === JSON.stringify(right);
    }

    return Object.is(left, right);
  }
}
