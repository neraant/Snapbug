import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "./button";
import { Mascot } from "./mascot";
import { Skeleton } from "./skeleton";
import { Typography } from "./typography";

function TableShell({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="table-shell"
      className={cn("w-full overflow-hidden rounded-lg border border-border bg-card", className)}
      {...props}
    />
  );
}

function TableScroll({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="table-scroll"
      className={cn("relative min-h-0 w-full min-w-0 overflow-x-auto overflow-y-auto", className)}
      {...props}
    />
  );
}

type TableToolbarProps = ComponentProps<typeof Row>;

function TableToolbar({ className, children, ...props }: TableToolbarProps) {
  return (
    <Row align="center" gap="sm" wrap width="full" className={cn("min-h-10 gap-3", className)} {...props}>
      {children}
    </Row>
  );
}

type TableEmptyProps = {
  message: string;
  action?: ReactNode;
  mascot?: boolean;
};

function TableEmpty({ message, action, mascot = true }: TableEmptyProps) {
  return (
    <Column align="center" justify="center" gap="md" width="full" className="px-4 py-16">
      {mascot ? <Mascot mood="happy" size="lg" /> : null}
      <Typography variant="text-sm" color="muted" align="center">
        {message}
      </Typography>
      {action}
    </Column>
  );
}

type TableLoadingProps = {
  colSpan: number;
  rows?: number;
};

function TableLoading({ colSpan, rows = 6 }: TableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <Table.Row key={index}>
          <Table.Cell colSpan={colSpan}>
            <Skeleton className="h-9 w-full" />
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
}

type TableErrorProps = {
  message: string;
  retryLabel: string;
  onRetry: VoidFunction;
};

function TableError({ message, retryLabel, onRetry }: TableErrorProps) {
  return (
    <Column align="center" justify="center" gap="md" width="full" className="px-4 py-16">
      <Typography variant="text-sm" color="muted" align="center">
        {message}
      </Typography>
      <Button type="button" variant="outline" onClick={onRetry}>
        {retryLabel}
      </Button>
    </Column>
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm text-card-foreground", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead data-slot="table-header" className={cn("sticky top-0 z-10 bg-card [&_tr]:border-b", className)} {...props} />
  );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-9 px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "h-9 border-b border-border transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-3 py-2 align-middle text-sm whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}

Table.Shell = TableShell;
Table.Scroll = TableScroll;
Table.Toolbar = TableToolbar;
Table.Empty = TableEmpty;
Table.Loading = TableLoading;
Table.Error = TableError;
Table.Header = TableHeader;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
