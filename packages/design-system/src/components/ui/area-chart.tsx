"use client";

import {
  chartTooltipContentStyle,
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
} from "@workspace/design-system/lib/chart-tooltip-style.const";
import { useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AreaChartSeries = {
  key: string;
  label: string;
  color: string;
};

export type AreaChartPoint = {
  label: string;
  [seriesKey: string]: string | number;
};

type AreaChartProps = {
  points: AreaChartPoint[];
  series: AreaChartSeries[];
};

export function AreaChart({ points, series }: AreaChartProps) {
  const gradientPrefix = useId().replaceAll(":", "");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map((item) => (
            <linearGradient key={item.key} id={`${gradientPrefix}-${item.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={item.color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={item.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="4 4" vertical={false} className="stroke-border" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} width={32} />
        <Tooltip
          contentStyle={chartTooltipContentStyle}
          itemStyle={chartTooltipItemStyle}
          labelStyle={chartTooltipLabelStyle}
        />
        {series.length > 0 ? <Legend verticalAlign="bottom" height={36} /> : null}
        {series.map((item) => (
          <Area
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={item.color}
            fill={`url(#${gradientPrefix}-${item.key})`}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
