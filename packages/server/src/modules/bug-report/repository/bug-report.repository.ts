import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { bugReportTable } from "@workspace/database/schema";
import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type {
  DailyMetricRow,
  NullableStringCountRow,
  SeverityCountRow,
  StatusCountRow,
  WeekdayHourCountRow,
} from "@workspace/server/modules/bug-report/entity/bug-report.types";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { and, count, eq, gte, inArray, isNotNull, lt, sql } from "drizzle-orm";

const openStatuses = [BugReportStatus.NEW, BugReportStatus.IN_PROGRESS] as const;
const criticalHighSeverities = [BugReportSeverity.HIGH, BugReportSeverity.CRITICAL] as const;

export class BugReportRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): BugReportRepository {
    return new BugReportRepository(tx);
  }

  async findById(id: string): Promise<BugReport | null> {
    const [row] = await this.db.select().from(bugReportTable).where(eq(bugReportTable.id, id));
    return row ? BugReportMapper.fromPersistence(row) : null;
  }

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

  async countCreatedByWeekdayHour(projectIds: string[], from: Date, to: Date): Promise<WeekdayHourCountRow[]> {
    const weekdayBucket = sql<number>`extract(isodow from ${bugReportTable.createdAt} AT TIME ZONE 'UTC')`;
    const hourBucket = sql<number>`extract(hour from ${bugReportTable.createdAt} AT TIME ZONE 'UTC')`;
    const rows = await this.db
      .select({
        weekday: weekdayBucket,
        hour: hourBucket,
        count: count(),
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      )
      .groupBy(weekdayBucket, hourBucket)
      .orderBy(weekdayBucket, hourBucket);

    return rows.map((row) => ({
      weekday: Number(row.weekday),
      hour: Number(row.hour),
      count: Number(row.count),
    }));
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

  async countResolvedByDay(projectIds: string[], from: Date, to: Date): Promise<DailyMetricRow[]> {
    const dayBucket = sql<string>`date_trunc('day', ${bugReportTable.resolvedAt} AT TIME ZONE 'UTC')`;
    const rows = await this.db
      .select({
        day: dayBucket,
        value: count(),
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

    return rows.map((row) => ({ day: row.day, value: Number(row.value) }));
  }

  async countCreatedBySeverity(projectIds: string[], from: Date, to: Date): Promise<SeverityCountRow[]> {
    const rows = await this.db
      .select({
        severity: bugReportTable.severity,
        count: count(),
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      )
      .groupBy(bugReportTable.severity);

    return rows.map((row) => ({
      severity: row.severity,
      count: Number(row.count),
    }));
  }

  async countCreatedByStatus(projectIds: string[], from: Date, to: Date): Promise<StatusCountRow[]> {
    const rows = await this.db
      .select({
        status: bugReportTable.status,
        count: count(),
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      )
      .groupBy(bugReportTable.status);

    return rows.map((row) => ({
      status: row.status,
      count: Number(row.count),
    }));
  }

  async countCreatedByUrl(projectIds: string[], from: Date, to: Date): Promise<NullableStringCountRow[]> {
    const rows = await this.db
      .select({
        value: bugReportTable.url,
        count: count(),
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      )
      .groupBy(bugReportTable.url);

    return rows.map((row) => ({
      value: row.value,
      count: Number(row.count),
    }));
  }

  async countCreatedByBrowser(projectIds: string[], from: Date, to: Date): Promise<NullableStringCountRow[]> {
    return this.countCreatedByStringColumn(bugReportTable.browser, projectIds, from, to);
  }

  async countCreatedByOs(projectIds: string[], from: Date, to: Date): Promise<NullableStringCountRow[]> {
    return this.countCreatedByStringColumn(bugReportTable.os, projectIds, from, to);
  }

  async countCreatedByDevice(projectIds: string[], from: Date, to: Date): Promise<NullableStringCountRow[]> {
    return this.countCreatedByStringColumn(bugReportTable.device, projectIds, from, to);
  }

  private async countCreatedByStringColumn(
    column: typeof bugReportTable.browser,
    projectIds: string[],
    from: Date,
    to: Date,
  ): Promise<NullableStringCountRow[]> {
    const rows = await this.db
      .select({
        value: column,
        count: count(),
      })
      .from(bugReportTable)
      .where(
        and(
          inArray(bugReportTable.projectId, projectIds),
          gte(bugReportTable.createdAt, from),
          lt(bugReportTable.createdAt, to),
        ),
      )
      .groupBy(column);

    return rows.map((row) => ({
      value: row.value,
      count: Number(row.count),
    }));
  }
}
