import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { BugReportPersistedType } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import type { FindRecentOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-recent.schema";
import type { FindWorkloadOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-workload.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

const unassignedWorkloadName = "Unassigned";

type FindRecentItemDtoType = FindRecentOutputDtoType[number];
type FindWorkloadItemDtoType = FindWorkloadOutputDtoType[number];

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
      shortId: row.shortId,
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

  static toRecentItemDto(
    bugReport: BugReport,
    context: { projectName: string; assignee: UserModelType | null },
  ): FindRecentItemDtoType {
    const dto = BugReportMapper.toDto(bugReport);

    return {
      id: dto.id,
      shortId: dto.shortId,
      title: dto.title,
      severity: dto.severity,
      browser: dto.browser,
      createdAt: dto.createdAt,
      projectName: context.projectName,
      assignee: context.assignee
        ? { id: context.assignee.id, name: context.assignee.name, email: context.assignee.email }
        : null,
    };
  }

  static toRecentOutput(
    bugReports: BugReport[],
    projectNameById: Map<string, string>,
    userById: Map<string, UserModelType>,
  ): FindRecentOutputDtoType {
    return bugReports.map((bugReport) => {
      const assignee = bugReport.assignedTo ? (userById.get(bugReport.assignedTo) ?? null) : null;

      return BugReportMapper.toRecentItemDto(bugReport, {
        projectName: projectNameById.get(bugReport.projectId) ?? "",
        assignee,
      });
    });
  }

  static toWorkloadItemDto(user: UserModelType, openCount: number): FindWorkloadItemDtoType {
    return {
      userId: user.id,
      name: user.name?.trim() || user.email,
      email: user.email,
      openCount,
    };
  }

  static toUnassignedWorkloadItem(openCount: number): FindWorkloadItemDtoType {
    return {
      userId: null,
      name: unassignedWorkloadName,
      email: null,
      openCount,
    };
  }

  static toWorkloadOutput(
    users: UserModelType[],
    openCountByAssignee: Map<string | null, number>,
  ): FindWorkloadOutputDtoType {
    const items: FindWorkloadOutputDtoType = users.map((user) =>
      BugReportMapper.toWorkloadItemDto(user, openCountByAssignee.get(user.id) ?? 0),
    );

    items.push(BugReportMapper.toUnassignedWorkloadItem(openCountByAssignee.get(null) ?? 0));
    items.sort((left, right) => right.openCount - left.openCount || left.name.localeCompare(right.name));

    return items;
  }
}
