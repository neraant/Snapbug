import { UTCDate } from "@date-fns/utc";
import type {
  DailyMetricRow,
  NullableStringCountRow,
  SeverityCountRow,
  StatusCountRow,
} from "@workspace/server/modules/bug-report/entity/bug-report.types";
import type { OpenMetricsAtInstant } from "@workspace/server/shared/audit/audit-log.types";
import { bugReportSeverities } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatId } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-id.const";
import type { BugReportStatPeriodDaysType } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";
import { bugReportStatuses } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import type { FindBreakdownsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";
import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";
import type { FindStatsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { addDays, formatISO, startOfDay, subDays } from "date-fns";

const MS_PER_HOUR = 60 * 60 * 1000;
const SPARKLINE_DAY_COUNT = 7;

export type StatComparisonWindows = {
  now: Date;
  currentPeriodStart: Date;
  previousPeriodStart: Date;
  sparklineDayStarts: Date[];
  sparklineFrom: Date;
  sparklineTo: Date;
};

export type ChartPeriodWindows = {
  dayStarts: Date[];
  queryFrom: Date;
  queryTo: Date;
};

export class BugReportStatService {
  getChartPeriodWindows(periodDays: BugReportStatPeriodDaysType, reference = new UTCDate()): ChartPeriodWindows {
    const dayStarts = this.getUtcDayStartsForPeriod(reference, periodDays);
    const queryFrom = dayStarts[0]!;
    const queryTo = addDays(dayStarts[dayStarts.length - 1]!, 1);

    return { dayStarts, queryFrom, queryTo };
  }

  buildZeroBreakdowns(): FindBreakdownsOutputDtoType {
    return {
      status: bugReportStatuses.map((status) => ({ status, count: 0 })),
      pages: [],
      browser: { total: 0, items: [] },
      os: { total: 0, items: [] },
      device: { total: 0, items: [] },
    };
  }

  buildBreakdownsFromAggregates(input: {
    statusCounts: StatusCountRow[];
    urlCounts: NullableStringCountRow[];
    browserCounts: NullableStringCountRow[];
    osCounts: NullableStringCountRow[];
    deviceCounts: NullableStringCountRow[];
  }): FindBreakdownsOutputDtoType {
    const { statusCounts, urlCounts, browserCounts, osCounts, deviceCounts } = input;

    const statusByKey = new Map(statusCounts.map((row) => [row.status, row.count]));

    return {
      status: bugReportStatuses.map((status) => ({
        status,
        count: statusByKey.get(status) ?? 0,
      })),
      pages: this.buildTopPageBreakdown(urlCounts),
      browser: this.buildEnvironmentBreakdown(browserCounts),
      os: this.buildEnvironmentBreakdown(osCounts),
      device: this.buildEnvironmentBreakdown(deviceCounts),
    };
  }

  normalizeBugReportPageLabel(url: string | null): string | null {
    if (!url?.trim()) return null;

    try {
      const parsed = new URL(url.includes("://") ? url : `https://${url}`);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

      let host = parsed.hostname.toLowerCase();
      const port = parsed.port;
      if (port && port !== "80" && port !== "443") {
        host = `${host}:${port}`;
      }

      let pathname = parsed.pathname;
      if (pathname.length > 1 && pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
      }

      if (!host || !this.isRecognizedPageHost(host)) return null;

      return `${host}${pathname}`;
    } catch {
      return null;
    }
  }

  buildZeroCharts(periodDays: BugReportStatPeriodDaysType, reference = new UTCDate()): FindChartsOutputDtoType {
    const { dayStarts } = this.getChartPeriodWindows(periodDays, reference);
    return {
      points: dayStarts.map((day) => ({
        day: this.utcDayKey(day),
        created: 0,
        resolved: 0,
      })),
      severity: bugReportSeverities.map((severity) => ({ severity, count: 0 })),
    };
  }

  buildChartsFromAggregates(input: {
    dayStarts: Date[];
    createdByDay: DailyMetricRow[];
    resolvedByDay: DailyMetricRow[];
    severityCounts: SeverityCountRow[];
  }): FindChartsOutputDtoType {
    const { dayStarts, createdByDay, resolvedByDay, severityCounts } = input;

    const createdByDayKey = new Map(createdByDay.map((row) => [this.utcDayKey(row.day), row.value]));
    const resolvedByDayKey = new Map(resolvedByDay.map((row) => [this.utcDayKey(row.day), row.value]));
    const severityByKey = new Map(severityCounts.map((row) => [row.severity, row.count]));

    return {
      points: dayStarts.map((day) => {
        const key = this.utcDayKey(day);
        return {
          day: key,
          created: createdByDayKey.get(key) ?? 0,
          resolved: resolvedByDayKey.get(key) ?? 0,
        };
      }),
      severity: bugReportSeverities.map((severity) => ({
        severity,
        count: severityByKey.get(severity) ?? 0,
      })),
    };
  }

  getComparisonWindows(periodDays: BugReportStatPeriodDaysType, reference = new UTCDate()): StatComparisonWindows {
    const now = reference;
    const currentPeriodStart = subDays(now, periodDays);
    const previousPeriodStart = subDays(now, periodDays * 2);
    const sparklineDayStarts = this.getLastUtcDayStarts(now, SPARKLINE_DAY_COUNT);
    const sparklineFrom = sparklineDayStarts[0]!;
    const sparklineTo = addDays(sparklineDayStarts[sparklineDayStarts.length - 1]!, 1);

    return {
      now,
      currentPeriodStart,
      previousPeriodStart,
      sparklineDayStarts,
      sparklineFrom,
      sparklineTo,
    };
  }

  calcChangePercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  formatResolveDuration(durationMs: number): string {
    if (durationMs <= 0) return "0h";

    const totalHours = Math.floor(durationMs / MS_PER_HOUR);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0) {
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }

    return `${hours}h`;
  }

  resolveDurationToSparklineHours(durationMs: number): number {
    if (durationMs <= 0) return 0;
    return Math.round(durationMs / MS_PER_HOUR);
  }

  mapDailyMetricsToSparkline(dayStarts: Date[], rows: DailyMetricRow[]) {
    const byDay = new Map(rows.map((row) => [this.utcDayKey(row.day), row.value]));
    return dayStarts.map((day) => ({ value: byDay.get(this.utcDayKey(day)) ?? 0 }));
  }

  flatSparkline(value: number) {
    return Array.from({ length: SPARKLINE_DAY_COUNT }, () => ({ value }));
  }

  buildZeroItems(): FindStatsOutputDtoType["items"] {
    const sparkline = this.flatSparkline(0);
    return [
      { id: BugReportStatId.NEW_REPORT, value: "0", changePercent: 0, sparkline },
      { id: BugReportStatId.OPEN_ISSUE, value: "0", changePercent: 0, sparkline },
      { id: BugReportStatId.CRITICAL_HIGH_OPEN, value: "0", changePercent: 0, sparkline },
      { id: BugReportStatId.MEDIAN_TIME_TO_RESOLVE, value: "0h", changePercent: 0, sparkline },
    ];
  }

  buildItemsFromAggregates(input: {
    windows: StatComparisonWindows;
    newReportsCurrent: number;
    newReportsPrevious: number;
    newReportsByDay: DailyMetricRow[];
    openCount: number;
    criticalHighOpenCount: number;
    openAtPeriodStart: number;
    criticalHighAtPeriodStart: number;
    openMetricsByDay: OpenMetricsAtInstant[];
    medianCurrentMs: number;
    medianPreviousMs: number;
    medianByDay: DailyMetricRow[];
  }): FindStatsOutputDtoType["items"] {
    const {
      windows,
      newReportsCurrent,
      newReportsPrevious,
      newReportsByDay,
      openCount,
      criticalHighOpenCount,
      openAtPeriodStart,
      criticalHighAtPeriodStart,
      openMetricsByDay,
      medianCurrentMs,
      medianPreviousMs,
      medianByDay,
    } = input;

    const newReportSparkline = this.mapDailyMetricsToSparkline(windows.sparklineDayStarts, newReportsByDay);
    const medianSparkline = this.mapDailyMetricsToSparkline(windows.sparklineDayStarts, medianByDay).map((point) => ({
      value: this.resolveDurationToSparklineHours(point.value),
    }));

    const openSparkline = this.buildOpenSparkline(openMetricsByDay, openCount);
    const criticalHighSparkline = this.buildCriticalHighSparkline(openMetricsByDay, criticalHighOpenCount);

    return [
      {
        id: BugReportStatId.NEW_REPORT,
        value: String(newReportsCurrent),
        changePercent: this.calcChangePercent(newReportsCurrent, newReportsPrevious),
        sparkline: newReportSparkline,
      },
      {
        id: BugReportStatId.OPEN_ISSUE,
        value: String(openCount),
        changePercent: this.calcChangePercent(openCount, openAtPeriodStart),
        sparkline: openSparkline,
      },
      {
        id: BugReportStatId.CRITICAL_HIGH_OPEN,
        value: String(criticalHighOpenCount),
        changePercent: this.calcChangePercent(criticalHighOpenCount, criticalHighAtPeriodStart),
        sparkline: criticalHighSparkline,
      },
      {
        id: BugReportStatId.MEDIAN_TIME_TO_RESOLVE,
        value: this.formatResolveDuration(medianCurrentMs),
        changePercent: this.calcChangePercent(medianCurrentMs, medianPreviousMs),
        sparkline: medianSparkline,
      },
    ];
  }

  private buildOpenSparkline(metricsByDay: OpenMetricsAtInstant[], liveOpenCount: number) {
    const sparkline = metricsByDay.map((metrics) => ({ value: metrics.open }));
    if (sparkline.length > 0) {
      sparkline[sparkline.length - 1] = { value: liveOpenCount };
    }
    return sparkline;
  }

  private buildCriticalHighSparkline(metricsByDay: OpenMetricsAtInstant[], liveCriticalHighCount: number) {
    const sparkline = metricsByDay.map((metrics) => ({ value: metrics.criticalHigh }));
    if (sparkline.length > 0) {
      sparkline[sparkline.length - 1] = { value: liveCriticalHighCount };
    }
    return sparkline;
  }

  private getUtcDayStartsForPeriod(reference: Date, periodDays: number): Date[] {
    const todayStart = startOfDay(reference);
    const firstDay = subDays(todayStart, periodDays - 1);
    return Array.from({ length: periodDays }, (_, index) => addDays(firstDay, index));
  }

  private getLastUtcDayStarts(reference: Date, dayCount: number): Date[] {
    return this.getUtcDayStartsForPeriod(reference, dayCount);
  }

  private utcDayKey(date: Date | string): string {
    const normalized = typeof date === "string" ? new Date(date) : date;
    return formatISO(normalized, { representation: "date" });
  }

  private buildTopPageBreakdown(urlCounts: NullableStringCountRow[]) {
    const merged = new Map<string, number>();

    for (const row of urlCounts) {
      const label = this.normalizeBugReportPageLabel(row.value);
      if (!label) continue;
      merged.set(label, (merged.get(label) ?? 0) + row.count);
    }

    return this.rankTopFive(Array.from(merged.entries()).map(([label, count]) => ({ label, count })));
  }

  private buildEnvironmentBreakdown(rows: NullableStringCountRow[]) {
    const merged = new Map<string, number>();

    for (const row of rows) {
      const label = row.value?.trim();
      if (!label) continue;
      merged.set(label, (merged.get(label) ?? 0) + row.count);
    }

    const items = Array.from(merged.entries()).map(([label, count]) => ({ label, count }));
    const total = items.reduce((sum, item) => sum + item.count, 0);

    return {
      total,
      items: this.rankTopFive(items),
    };
  }

  private rankTopFive(items: { label: string; count: number }[]) {
    return [...items]
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
      .slice(0, 5);
  }

  private isRecognizedPageHost(host: string) {
    if (host === "localhost") return true;
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return true;
    return host.includes(".");
  }
}
