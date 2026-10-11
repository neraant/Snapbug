import type { AreaChartPoint } from "@workspace/design-system/components/ui/area-chart";
import { formatChartDayLabel } from "@workspace/design-system/lib/format-chart-day.util";
import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";

export function mapReportsOverTimePoints(points: FindChartsOutputDtoType["points"]): AreaChartPoint[] {
  return points.map((point) => ({
    label: formatChartDayLabel(point.day),
    created: point.created,
    resolved: point.resolved,
  }));
}
