import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Card } from "@workspace/design-system/components/ui/card";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { formatDistance } from "date-fns";
import { CameraIcon, CirclePlayIcon } from "lucide-react";
import { useCallback } from "react";

import { bugReportSeverityBadgeVariant } from "@/client/modules/ticket-board/consts/bug-report-severity-badge-variant.const";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { ticketBoardCardHeightClass } from "@/client/modules/ticket-board/consts/ticket-board.const";

type TicketBoardCardProps = {
  report: BugReportModelType;
  projectName?: string;
  dragEnabled: boolean;
};

export function TicketBoardCard({ report, projectName, dragEnabled }: TicketBoardCardProps) {
  if (dragEnabled) {
    return <TicketBoardCardDraggable report={report} projectName={projectName} />;
  }

  return (
    <div className={cn("shrink-0", ticketBoardCardHeightClass)}>
      <TicketBoardCardContent report={report} projectName={projectName} />
    </div>
  );
}

type TicketBoardCardDraggableProps = {
  report: BugReportModelType;
  projectName?: string;
};

function TicketBoardCardDraggable({ report, projectName }: TicketBoardCardDraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: report.id,
    data: { status: report.status },
  });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: report.id,
    data: { status: report.status },
  });

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDraggableNodeRef(node);
      setDroppableNodeRef(node);
    },
    [setDraggableNodeRef, setDroppableNodeRef],
  );

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={isDragging ? undefined : style}
      className={cn(
        "shrink-0 overflow-hidden transition-[height] duration-200 ease-out",
        isDragging ? "pointer-events-none h-0" : ticketBoardCardHeightClass,
      )}
      {...listeners}
      {...attributes}
    >
      <TicketBoardCardContent report={report} projectName={projectName} />
    </div>
  );
}

type TicketBoardCardContentProps = {
  report: BugReportModelType;
  projectName?: string;
};

function TicketBoardCardContent({ report, projectName }: TicketBoardCardContentProps) {
  const assigneeLabel = texts.card.unassigned;

  return (
    <Card
      gap="sm"
      padding="sm"
      width="full"
      minWidth="0"
      className={cn(ticketBoardCardHeightClass, "max-w-80 shrink-0")}
    >
      <Row align="center" justify="between" gap="sm" wrap={false} className="shrink-0">
        <Typography variant="text-xs" color="muted">
          {report.shortId}
        </Typography>
        <Badge variant={bugReportSeverityBadgeVariant[report.severity]}>{texts.severityLabels[report.severity]}</Badge>
      </Row>
      <Typography variant="label" lineClamp={2} className="min-h-10 shrink-0">
        {report.title}
      </Typography>
      <Typography variant="text-xs" color="muted" truncate className="shrink-0">
        {projectName ?? "\u00a0"}
      </Typography>
      <Row align="center" justify="between" gap="sm" wrap={false} className="min-h-0 shrink-0">
        <Typography variant="text-xs" color="muted" truncate className="min-w-0">
          {[report.browser, report.os].filter(Boolean).join(" · ") || "—"}
        </Typography>
        <Row align="center" gap="xs" wrap={false} className="shrink-0">
          {report.hasScreenshot ? (
            <CameraIcon className="size-3.5 text-muted-foreground" aria-label={texts.card.screenshot} />
          ) : null}
          {report.hasReplay ? (
            <CirclePlayIcon className="size-3.5 text-muted-foreground" aria-label={texts.card.replay} />
          ) : null}
        </Row>
      </Row>
      <Row align="center" justify="between" gap="sm" wrap={false} className="shrink-0">
        <Row align="center" gap="xs" wrap={false}>
          <Avatar size="xs">
            <AvatarFallback>{assigneeLabel.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <Typography variant="text-xs" color="muted">
            {assigneeLabel}
          </Typography>
        </Row>
        <Typography variant="text-xs" color="muted">
          {formatDistance(new Date(report.createdAt), new Date(), { addSuffix: true })}
        </Typography>
      </Row>
    </Card>
  );
}
