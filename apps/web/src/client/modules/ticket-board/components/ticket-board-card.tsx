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
    <div>
      <TicketBoardCardContent report={report} projectName={projectName} isDragging={false} />
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
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TicketBoardCardContent report={report} projectName={projectName} isDragging={isDragging} />
    </div>
  );
}

type TicketBoardCardContentProps = {
  report: BugReportModelType;
  projectName?: string;
  isDragging: boolean;
};

function TicketBoardCardContent({ report, projectName, isDragging }: TicketBoardCardContentProps) {
  const assigneeLabel = texts.card.unassigned;

  return (
    <Card gap="sm" padding="sm" width="full" minWidth="0" className={cn("max-w-80", isDragging && "opacity-60")}>
      <Row align="center" justify="between" gap="sm" wrap={false}>
        <Typography variant="text-xs" color="muted">
          {report.shortId}
        </Typography>
        <Badge variant={bugReportSeverityBadgeVariant[report.severity]}>{texts.severityLabels[report.severity]}</Badge>
      </Row>
      <Typography variant="label" lineClamp={2}>
        {report.title}
      </Typography>
      {projectName ? (
        <Typography variant="text-xs" color="muted">
          {projectName}
        </Typography>
      ) : null}
      <Row align="center" justify="between" gap="sm" wrap>
        <Typography variant="text-xs" color="muted">
          {[report.browser, report.os].filter(Boolean).join(" · ") || "—"}
        </Typography>
        <Row align="center" gap="xs" wrap={false}>
          {report.hasScreenshot ? (
            <CameraIcon className="size-3.5 text-muted-foreground" aria-label={texts.card.screenshot} />
          ) : null}
          {report.hasReplay ? (
            <CirclePlayIcon className="size-3.5 text-muted-foreground" aria-label={texts.card.replay} />
          ) : null}
        </Row>
      </Row>
      <Row align="center" justify="between" gap="sm" wrap={false}>
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
