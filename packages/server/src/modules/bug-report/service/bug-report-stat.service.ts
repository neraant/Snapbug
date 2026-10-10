import { UTCDate } from "@date-fns/utc";
import type { DailyMetricRow } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import { BugReportStatId } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-id.const";
import type { FindStatsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { addDays, formatISO, startOfDay, subDays } from "date-fns";

const MS_PER_HOUR = 60 * 60 * 1000;
const SPARKLINE_DAY_COUNT = 7;
const COMPARISON_PERIOD_DAYS = 30;

export type StatComparisonWindows = {
  now: Date;
  currentPeriodStart: Date;
  previousPeriodStart: Date;
  sparklineDayStarts: Date[];
  sparklineFrom: Date;
  sparklineTo: Date;
};

export class BugReportStatService {
  getComparisonWindows(reference = new UTCDate()): StatComparisonWindows {
    const now = reference;
    const currentPeriodStart = subDays(now, COMPARISON_PERIOD_DAYS);
    const previousPeriodStart = subDays(now, COMPARISON_PERIOD_DAYS * 2);
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
      medianCurrentMs,
      medianPreviousMs,
      medianByDay,
    } = input;

    const newReportSparkline = this.mapDailyMetricsToSparkline(windows.sparklineDayStarts, newReportsByDay);
    const medianSparkline = this.mapDailyMetricsToSparkline(windows.sparklineDayStarts, medianByDay).map((point) => ({
      value: this.resolveDurationToSparklineHours(point.value),
    }));

    // TODO(audit-log): compute changePercent and historical sparkline for open-issue cards from status-change events.
    const openSparkline = this.flatSparkline(openCount);
    const criticalHighSparkline = this.flatSparkline(criticalHighOpenCount);

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
        changePercent: 0,
        sparkline: openSparkline,
      },
      {
        id: BugReportStatId.CRITICAL_HIGH_OPEN,
        value: String(criticalHighOpenCount),
        changePercent: 0,
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

  private getLastUtcDayStarts(reference: Date, dayCount: number): Date[] {
    const todayStart = startOfDay(reference);
    const firstDay = subDays(todayStart, dayCount - 1);
    return Array.from({ length: dayCount }, (_, index) => addDays(firstDay, index));
  }

  private utcDayKey(date: Date | string): string {
    const normalized = typeof date === "string" ? new Date(date) : date;
    return formatISO(normalized, { representation: "date" });
  }
}
