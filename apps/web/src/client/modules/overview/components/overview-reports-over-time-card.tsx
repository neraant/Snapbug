import { AreaChart } from "@workspace/design-system/components/ui/area-chart";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { cn } from "@workspace/design-system/lib/utils";
import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";
import { useState } from "react";

import {
  reportsOverTimeSeriesColor,
  reportsOverTimeSeriesId,
  type ReportsOverTimeSeriesIdType,
} from "@/client/modules/overview/consts/reports-over-time.const";
import { texts } from "@/client/modules/overview/consts/texts.const";
import { mapReportsOverTimePoints } from "@/client/modules/overview/utils/map-reports-over-time-points.util";

type OverviewReportsOverTimeCardProps = {
  points: FindChartsOutputDtoType["points"];
  className?: string;
};

const seriesItems = [
  {
    value: reportsOverTimeSeriesId.ALL,
    get label() {
      return texts.chart.reportsOverTime.series.all;
    },
  },
  {
    value: reportsOverTimeSeriesId.CREATED,
    get label() {
      return texts.chart.reportsOverTime.series.created;
    },
  },
  {
    value: reportsOverTimeSeriesId.RESOLVED,
    get label() {
      return texts.chart.reportsOverTime.series.resolved;
    },
  },
];

const seriesCatalog = [
  {
    key: reportsOverTimeSeriesId.CREATED,
    get label() {
      return texts.chart.reportsOverTime.legend.created;
    },
    color: reportsOverTimeSeriesColor.created,
  },
  {
    key: reportsOverTimeSeriesId.RESOLVED,
    get label() {
      return texts.chart.reportsOverTime.legend.resolved;
    },
    color: reportsOverTimeSeriesColor.resolved,
  },
];

export function OverviewReportsOverTimeCard({ points, className }: OverviewReportsOverTimeCardProps) {
  const [seriesId, setSeriesId] = useState<ReportsOverTimeSeriesIdType>(reportsOverTimeSeriesId.ALL);
  const series =
    seriesId === reportsOverTimeSeriesId.ALL ? seriesCatalog : seriesCatalog.filter((item) => item.key === seriesId);

  return (
    <Panel className={cn(className)}>
      <Panel.Header
        title={texts.chart.reportsOverTime.title}
        description={texts.chart.reportsOverTime.description}
        action={
          <SegmentedControl
            size="sm"
            value={seriesId}
            onValueChange={(value) => setSeriesId(value as ReportsOverTimeSeriesIdType)}
            items={seriesItems}
            aria-label={texts.chart.reportsOverTime.seriesAriaLabel}
          />
        }
      />
      <Panel.Content className="h-72">
        <AreaChart points={mapReportsOverTimePoints(points)} series={series} />
      </Panel.Content>
    </Panel>
  );
}
