import type { HeatmapRow } from "@workspace/design-system/components/ui/heatmap";
import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";

import { texts } from "@/client/modules/overview/consts/texts.const";

const weekdayOrder = [1, 2, 3, 4, 5, 6, 7] as const;

export function mapChartHoursToHeatmapRows(hours: FindChartsOutputDtoType["hours"]): HeatmapRow[] {
  const valuesByWeekday = new Map<number, number[]>();

  for (const weekday of weekdayOrder) {
    valuesByWeekday.set(
      weekday,
      Array.from({ length: 24 }, () => 0),
    );
  }

  for (const cell of hours) {
    const row = valuesByWeekday.get(cell.weekday);
    if (row) {
      row[cell.hour] = cell.count;
    }
  }

  return weekdayOrder.map((weekday) => ({
    key: String(weekday),
    label: texts.chart.busiestHours.weekdayLabels[weekday],
    values: valuesByWeekday.get(weekday) ?? Array.from({ length: 24 }, () => 0),
  }));
}
