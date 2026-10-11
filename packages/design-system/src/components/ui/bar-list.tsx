import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { BarTrack, BarTrackSegment } from "@workspace/design-system/components/ui/bar-track";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { ReactNode } from "react";

export type BarListItem = {
  key: string;
  label: ReactNode;
  value: ReactNode;
  count: number;
  icon?: ReactNode;
};

type BarListProps = {
  items: BarListItem[];
  scale: "max" | "total";
  total?: number;
  emptyLabel: string;
  barClassName?: string;
  className?: string;
};

function resolveBarWidthPercent(count: number, scale: BarListProps["scale"], total: number, maxCount: number) {
  if (count <= 0) return 0;
  if (scale === "max") {
    if (maxCount <= 0) return 0;
    return (count / maxCount) * 100;
  }
  if (total <= 0) return 0;
  return (count / total) * 100;
}

function BarList({ items, scale, total = 0, emptyLabel, barClassName, className }: BarListProps) {
  const maxCount = items.reduce((max, item) => Math.max(max, item.count), 0);

  if (items.length === 0) {
    return (
      <Typography variant="text-sm" color="muted" className={className}>
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Column data-slot="bar-list" gap="md" className={cn("w-full min-w-0", className)}>
      {items.map((item) => {
        const widthPercent = resolveBarWidthPercent(item.count, scale, total, maxCount);

        return (
          <Column key={item.key} gap="xs" minWidth="0">
            <Row align="center" justify="between" gap="sm" minWidth="0" wrap={false}>
              <Row align="center" gap="sm" minWidth="0" wrap={false} className="min-w-0 flex-1">
                {item.icon ? <Column className="shrink-0 text-muted-foreground">{item.icon}</Column> : null}
                <Column minWidth="0" className="min-w-0 truncate">
                  {item.label}
                </Column>
              </Row>
              <Column className="shrink-0">{item.value}</Column>
            </Row>
            <BarTrack>
              <BarTrackSegment percent={widthPercent} className={barClassName} />
            </BarTrack>
          </Column>
        );
      })}
    </Column>
  );
}

export { BarList };
