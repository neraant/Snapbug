import { DonutChart } from "@workspace/design-system/components/ui/donut-chart";
import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { cn } from "@workspace/design-system/lib/utils";
import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";

import { texts } from "@/client/modules/overview/consts/texts.const";
import { mapSeverityToDonutSlices } from "@/client/modules/overview/utils/map-severity-to-donut-slices.util";

type OverviewBySeverityCardProps = {
  severity: FindChartsOutputDtoType["severity"];
  className?: string;
};

export function OverviewBySeverityCard({ severity, className }: OverviewBySeverityCardProps) {
  const slices = mapSeverityToDonutSlices(severity, texts.chart.bySeverity.severityLabels);

  return (
    <MetricCard className={cn(className)}>
      <MetricCard.Header title={texts.chart.bySeverity.title} description={texts.chart.bySeverity.description} />
      <MetricCard.Content className="h-72">
        <DonutChart slices={slices} centerCaption={texts.chart.bySeverity.centerLabel} />
      </MetricCard.Content>
    </MetricCard>
  );
}
