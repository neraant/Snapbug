import type { DonutChartSlice } from "@workspace/design-system/components/ui/donut-chart";
import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";

import {
  severityDonutColor,
  type SeverityDonutKeyType,
  severityDonutLegendOrder,
} from "@/client/modules/overview/consts/severity-donut.const";

type SeverityLabels = Record<BugReportSeverity, string>;

export function mapSeverityToDonutSlices(
  severity: FindChartsOutputDtoType["severity"],
  labels: SeverityLabels,
): DonutChartSlice[] {
  const countBySeverity = new Map(severity.map((row) => [row.severity, row.count]));

  return severityDonutLegendOrder.map((key: SeverityDonutKeyType) => ({
    key,
    label: labels[key as BugReportSeverity],
    value: countBySeverity.get(key as BugReportSeverity) ?? 0,
    color: severityDonutColor[key],
  }));
}
