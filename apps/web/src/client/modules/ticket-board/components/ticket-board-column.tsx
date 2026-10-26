import { useDroppable } from "@dnd-kit/core";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { StatusIndicator } from "@workspace/design-system/components/ui/status-indicator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { Fragment, type Ref, useEffect, useState } from "react";

import { TicketBoardCard } from "@/client/modules/ticket-board/components/ticket-board-card";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { ticketBoardCardHeightClass } from "@/client/modules/ticket-board/consts/ticket-board.const";

type TicketBoardColumnProps = {
  status: BugReportStatus;
  reports: BugReportModelType[];
  visibleCount: number;
  projectNameById: Map<string, string>;
  showProjectName: boolean;
  onLoadMore: () => void;
  insertionIndex: number | null;
  isDraggingTicket: boolean;
  dragEnabled: boolean;
};

export function TicketBoardColumn(props: TicketBoardColumnProps) {
  if (props.dragEnabled) {
    return <TicketBoardColumnDraggable {...props} />;
  }

  return <TicketBoardColumnView {...props} columnRef={undefined} isOver={false} />;
}

type TicketBoardColumnDraggableProps = TicketBoardColumnProps;

function TicketBoardColumnDraggable(props: TicketBoardColumnDraggableProps) {
  const { setNodeRef, isOver } = useDroppable({ id: props.status });

  return <TicketBoardColumnView {...props} columnRef={setNodeRef} isOver={isOver} />;
}

type TicketBoardColumnViewProps = TicketBoardColumnProps & {
  columnRef: Ref<HTMLDivElement> | undefined;
  isOver: boolean;
};

function TicketBoardColumnView({
  status,
  reports,
  visibleCount,
  projectNameById,
  showProjectName,
  onLoadMore,
  insertionIndex,
  isDraggingTicket,
  dragEnabled,
  columnRef,
  isOver,
}: TicketBoardColumnViewProps) {
  const columnText = texts.column[status];
  const visibleReports = reports.slice(0, visibleCount);
  const hasMore = reports.length > visibleCount;
  const showInsertion = isDraggingTicket && insertionIndex !== null;

  const headerTrigger = (
    <Button variant="ghost" size="sm" className="h-auto px-0">
      <Row align="center" gap="sm" wrap={false}>
        <StatusIndicator status={status} />
        <Typography variant="label">{columnText.label}</Typography>
      </Row>
    </Button>
  );

  return (
    <div
      ref={columnRef}
      className={cn(
        "flex h-full min-h-0 w-full max-w-80 min-w-80 flex-1 shrink-0 flex-col",
        isOver ? "rounded-lg bg-muted/50" : undefined,
      )}
    >
      <Column gap="sm" padding="sm" minWidth="0" width="full" className="flex h-full min-h-0 flex-col">
        <Row align="center" gap="sm" wrap={false} className="shrink-0">
          <Tooltip>
            <TooltipTrigger render={headerTrigger} />
            <TooltipContent>{columnText.hint}</TooltipContent>
          </Tooltip>
          <Typography variant="text-xs" color="muted">
            {reports.length}
          </Typography>
        </Row>
        <Column gap="sm" minWidth="0" width="full" className="min-h-0 flex-1 overflow-y-auto">
          {visibleReports.length === 0 ? (
            <>
              {showInsertion && insertionIndex === 0 ? <TicketBoardDropPlaceholder /> : null}
              <Typography variant="text-sm" color="muted">
                {columnText.empty}
              </Typography>
            </>
          ) : (
            <>
              {showInsertion && insertionIndex === 0 ? <TicketBoardDropPlaceholder /> : null}
              {visibleReports.map((report, reportIndex) => (
                <Fragment key={report.id}>
                  <TicketBoardCard
                    report={report}
                    projectName={showProjectName ? projectNameById.get(report.projectId) : undefined}
                    dragEnabled={dragEnabled}
                  />
                  {showInsertion && insertionIndex === reportIndex + 1 ? <TicketBoardDropPlaceholder /> : null}
                </Fragment>
              ))}
            </>
          )}
          {hasMore ? (
            <Button variant="ghost" size="sm" className="shrink-0" onClick={onLoadMore}>
              {texts.column.loadMore}
            </Button>
          ) : null}
        </Column>
      </Column>
    </div>
  );
}

function TicketBoardDropPlaceholder() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        ticketBoardCardHeightClass,
        "w-full shrink-0 rounded-lg border-2 border-dashed border-primary/60 bg-primary/5 transition-opacity duration-200 ease-out",
        open ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
