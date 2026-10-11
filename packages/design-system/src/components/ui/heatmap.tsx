"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import {
  chartTooltipContentStyle,
  chartTooltipWrapperStyle,
} from "@workspace/design-system/lib/chart-tooltip-style.const";
import {
  heatmapIntensityCellClassName,
  type HeatmapIntensityLevel,
  resolveHeatmapIntensityLevel,
} from "@workspace/design-system/lib/resolve-heatmap-intensity-level.util";
import { cn } from "@workspace/design-system/lib/utils";
import { useCallback, useState } from "react";

const heatmapColumnTemplate =
  "grid-cols-[repeat(24,minmax(1.25rem,1fr))] sm:grid-cols-[repeat(24,minmax(2rem,1fr))] md:grid-cols-[repeat(24,minmax(2.5rem,1fr))]";
const heatmapRowTemplate = "grid-cols-[2rem_minmax(0,1fr)]";

const heatmapCellButtonClassName =
  "h-[1.125rem] w-full min-w-0 rounded-[3px] border border-solid p-0 shadow-none hover:bg-transparent active:translate-y-0 hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-ring/50";

export type HeatmapRow = {
  key: string;
  label: string;
  values: number[];
};

type HeatmapHoveredCell = {
  rowIndex: number;
  columnIndex: number;
  top: number;
  left: number;
};

type HeatmapProps = {
  rows: HeatmapRow[];
  columnLabelInterval: number;
  formatColumnLabel: (columnIndex: number) => string;
  formatTooltip: (row: HeatmapRow, columnIndex: number, value: number) => string;
  formatAccessibleName: (row: HeatmapRow, columnIndex: number, value: number) => string;
  legendFewerLabel: string;
  legendMoreLabel: string;
  className?: string;
};

function Heatmap({
  rows,
  columnLabelInterval,
  formatColumnLabel,
  formatTooltip,
  formatAccessibleName,
  legendFewerLabel,
  legendMoreLabel,
  className,
}: HeatmapProps) {
  const columnCount = rows[0]?.values.length ?? 0;
  const maxCount = rows.reduce((max, row) => Math.max(max, ...row.values), 0);
  const [hovered, setHovered] = useState<HeatmapHoveredCell | null>(null);

  const showTooltip = useCallback((rowIndex: number, columnIndex: number, target: HTMLElement) => {
    const cellRect = target.getBoundingClientRect();

    setHovered({
      rowIndex,
      columnIndex,
      top: cellRect.top + cellRect.height / 2,
      left: cellRect.left + cellRect.width / 2,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setHovered(null);
  }, []);

  const hoveredRow = hovered ? rows[hovered.rowIndex] : null;
  const hoveredColumnIndex = hovered?.columnIndex;
  const hoveredValue =
    hoveredRow && hoveredColumnIndex !== undefined ? (hoveredRow.values[hoveredColumnIndex] ?? 0) : 0;
  const tooltipLabel =
    hoveredRow && hoveredColumnIndex !== undefined ? formatTooltip(hoveredRow, hoveredColumnIndex, hoveredValue) : "";

  return (
    <Column data-slot="heatmap" gap="md" width="full" minWidth="0" className={className}>
      <Column width="full" minWidth="0" className="relative max-w-full overflow-x-auto pb-2">
        <Column gap="sm" className="w-max min-w-full">
          <Grid gap="sm" className={heatmapRowTemplate}>
            <Column aria-hidden />
            <Grid gap="xs" className={heatmapColumnTemplate}>
              {Array.from({ length: columnCount }, (_, columnIndex) => (
                <Column key={columnIndex} justify="end" className="h-4 min-w-0">
                  {columnIndex % columnLabelInterval === 0 ? (
                    <Typography variant="text-xs" color="muted" font="mono" className="tabular-nums">
                      {formatColumnLabel(columnIndex)}
                    </Typography>
                  ) : null}
                </Column>
              ))}
            </Grid>
          </Grid>

          <Column className="gap-1.5">
            {rows.map((row, rowIndex) => (
              <Grid key={row.key} gap="sm" className={cn("items-center", heatmapRowTemplate)}>
                <Typography
                  variant="text-xs"
                  color="muted"
                  font="mono"
                  className="sticky left-0 z-10 bg-card p-1 pr-2 text-right tabular-nums"
                >
                  {row.label}
                </Typography>
                <Grid gap="xs" className={heatmapColumnTemplate}>
                  {row.values.map((value, columnIndex) => {
                    const intensity = resolveHeatmapIntensityLevel(value, maxCount);
                    return (
                      <Button
                        key={`${row.key}-${columnIndex}`}
                        variant="ghost"
                        className={cn(heatmapCellButtonClassName, heatmapIntensityCellClassName[intensity])}
                        aria-label={formatAccessibleName(row, columnIndex, value)}
                        onMouseEnter={(event) => {
                          showTooltip(rowIndex, columnIndex, event.currentTarget);
                        }}
                        onMouseLeave={hideTooltip}
                        onFocus={(event) => {
                          showTooltip(rowIndex, columnIndex, event.currentTarget);
                        }}
                        onBlur={hideTooltip}
                      />
                    );
                  })}
                </Grid>
              </Grid>
            ))}
          </Column>
        </Column>

        {hovered && tooltipLabel ? (
          <Column
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full px-1 pb-2"
            style={{
              top: hovered.top,
              left: hovered.left,
              ...chartTooltipWrapperStyle,
            }}
          >
            <Column padding="none" className="px-3 py-1.5 whitespace-nowrap" style={chartTooltipContentStyle}>
              <Typography variant="text-xs">{tooltipLabel}</Typography>
            </Column>
          </Column>
        ) : null}
      </Column>

      <Row align="center" justify="end" gap="sm" wrap={false} className="border-t border-border pt-2">
        <Typography variant="text-xs" color="muted" font="mono">
          {legendFewerLabel}
        </Typography>
        <Row gap="xs" wrap={false} aria-hidden>
          {([0, 1, 2, 3] satisfies HeatmapIntensityLevel[]).map((level) => (
            <Column
              key={level}
              className={cn("size-3 shrink-0 rounded-[2px] border border-solid", heatmapIntensityCellClassName[level])}
            />
          ))}
        </Row>
        <Typography variant="text-xs" color="muted" font="mono">
          {legendMoreLabel}
        </Typography>
      </Row>
    </Column>
  );
}

export { Heatmap };
