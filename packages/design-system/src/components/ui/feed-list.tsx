import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { ReactNode } from "react";

export type FeedListItem = {
  key: string;
  leading?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  accessory?: ReactNode;
};

type FeedListProps = {
  items: FeedListItem[];
  emptyLabel: string;
  className?: string;
};

function FeedList({ items, emptyLabel, className }: FeedListProps) {
  if (items.length === 0) {
    return (
      <Typography variant="text-sm" color="muted" className={className}>
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Column
      data-slot="feed-list"
      gap="none"
      className={cn("max-h-96 min-h-0 w-full min-w-0 overflow-y-auto", className)}
    >
      {items.map((item, index) => (
        <Column key={item.key} gap="none">
          {index > 0 ? <Separator /> : null}
          <Row align="center" justify="between" gap="md" minWidth="0" wrap={false} className="py-3">
            <Row align="center" gap="sm" minWidth="0" wrap={false} className="min-w-0 flex-1">
              {item.leading ? <Column className="shrink-0">{item.leading}</Column> : null}
              <Column gap="xs" minWidth="0" className="min-w-0">
                {item.title}
                {item.meta}
              </Column>
            </Row>
            <Row align="center" gap="sm" wrap={false} className="shrink-0">
              {item.trailing}
              {item.accessory}
            </Row>
          </Row>
        </Column>
      ))}
    </Column>
  );
}

export { FeedList };
