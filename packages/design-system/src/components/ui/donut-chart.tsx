"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Typography } from "@workspace/design-system/components/ui/typography";
import {
  chartTooltipContentStyle,
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
  chartTooltipWrapperStyle,
} from "@workspace/design-system/lib/chart-tooltip-style.const";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type DonutChartSlice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  slices: DonutChartSlice[];
  centerCaption: string;
};

export function DonutChart({ slices, centerCaption }: DonutChartProps) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <Column className="relative h-full min-h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius="58%"
            outerRadius="78%"
            paddingAngle={2}
            stroke="var(--color-card)"
            strokeWidth={2}
          >
            {slices.map((slice) => (
              <Cell key={slice.key} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={chartTooltipContentStyle}
            itemStyle={chartTooltipItemStyle}
            labelStyle={chartTooltipLabelStyle}
            wrapperStyle={chartTooltipWrapperStyle}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
      <Column align="center" justify="center" className="pointer-events-none absolute inset-0 pb-9">
        <Typography variant="heading-sm">{total}</Typography>
        <Typography variant="text-xs" color="muted" font="mono" className="tracking-wide uppercase">
          {centerCaption}
        </Typography>
      </Column>
    </Column>
  );
}
