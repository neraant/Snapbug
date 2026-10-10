import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { bugReportTable } from "@workspace/database/schema";
import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { DailyMetricRow } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { and, count, gte, inArray, isNotNull, lt, sql } from "drizzle-orm";

const openStatuses = [BugReportStatus.NEW, BugReportStatus.IN_PROGRESS] as const;
const criticalHighSeverities = [BugReportSeverity.HIGH, BugReportSeverity.CRITICAL] as const;

export class BugReportRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findManyByProjectIds(projectIds: string[]): Promise<BugReport[]> {
    const bugReports = await this.db.query.bugReportTable.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: "desc" },
    });
    return bugReports.map((bugReport) => BugReportMapper.fromPersistence(bugReport));
  }

  async save(bugReport: BugReport): Promise<void> {
    try {
      await this.db.insert(bugReportTable).values(BugReportMapper.toPersistence(bugReport));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async countCreatedBetween(projectIds: string[], from: Date, to: Date): Promise<number> {
    const [row] = await this.db
      .select({ count: count() })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      );
    return Number(row?.count ?? 0);
  }

  async countCreatedByDay(projectIds: string[], from: Date, to: Date): Promise<DailyMetricRow[]> {
    const dayBucket = sql<string>`date_trunc('day', ${bugReportTable.createdAt} AT TIME ZONE 'UTC')`;
    const rows = await this.db
      .select({
        day: dayBucket,
        value: count(),
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      )
      .groupBy(dayBucket)
      .orderBy(dayBucket);

    return rows.map((row) => ({ day: row.day, value: Number(row.value) }));
  }

  async countOpen(projectIds: string[]): Promise<number> {
    const [row] = await this.db
      .select({ count: count() })
      .from(bugReportTable)
      .where(and(inArray(bugReportTable.projectId, projectIds), inArray(bugReportTable.status, [...openStatuses])));
    return Number(row?.count ?? 0);
  }

  async countOpenCriticalHigh(projectIds: string[]): Promise<number> {
    const [row] = await this.db
      .select({ count: count() })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          inArray(bugReportTable.status, [...openStatuses]),
          inArray(bugReportTable.severity, [...criticalHighSeverities]),
        ),
      );
    return Number(row?.count ?? 0);
  }

  async medianResolveDurationMsBetween(projectIds: string[], from: Date, to: Date): Promise<number> {
    const durationSeconds = sql<number>`extract(epoch from (${bugReportTable.resolvedAt} - ${bugReportTable.createdAt}))`;
    const [row] = await this.db
      .select({
        medianSeconds: sql<number | null>`percentile_cont(0.5) within group (order by ${durationSeconds})`,
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          isNotNull(bugReportTable.resolvedAt),
          gte(bugReportTable.resolvedAt, from),
          lt(bugReportTable.resolvedAt, to),
        ),
      );

    const medianSeconds = row?.medianSeconds;
    if (medianSeconds === null || medianSeconds === undefined) return 0;
    return medianSeconds * 1000;
  }

  async medianResolveDurationMsByDay(projectIds: string[], from: Date, to: Date): Promise<DailyMetricRow[]> {
    const dayBucket = sql<string>`date_trunc('day', ${bugReportTable.resolvedAt} AT TIME ZONE 'UTC')`;
    const durationSeconds = sql<number>`extract(epoch from (${bugReportTable.resolvedAt} - ${bugReportTable.createdAt}))`;
    const rows = await this.db
      .select({
        day: dayBucket,
        value: sql<number | null>`percentile_cont(0.5) within group (order by ${durationSeconds})`,
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          isNotNull(bugReportTable.resolvedAt),
          gte(bugReportTable.resolvedAt, from),
          lt(bugReportTable.resolvedAt, to),
        ),
      )
      .groupBy(dayBucket)
      .orderBy(dayBucket);

    return rows.map((row) => ({
      day: row.day,
      value: row.value === null || row.value === undefined ? 0 : row.value * 1000,
    }));
  }
}
