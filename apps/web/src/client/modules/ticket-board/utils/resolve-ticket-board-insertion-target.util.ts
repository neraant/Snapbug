import type { ClientRect, DragOverEvent } from "@dnd-kit/core";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

import { ticketBoardStatuses } from "@/client/modules/ticket-board/consts/ticket-board.const";

export type TicketBoardInsertionTarget = {
  status: BugReportStatus;
  index: number;
};

type ResolveTicketBoardInsertionTargetInput = {
  event: DragOverEvent;
  reportsByStatus: Map<BugReportStatus, BugReportModelType[]>;
  visibleCountByStatus: Record<BugReportStatus, number>;
};

export function getDragPointerY(event: Pick<DragOverEvent, "activatorEvent" | "delta">): number | null {
  const { activatorEvent, delta } = event;

  if (activatorEvent instanceof MouseEvent) {
    return activatorEvent.clientY + delta.y;
  }
  if (activatorEvent instanceof PointerEvent) {
    return activatorEvent.clientY + delta.y;
  }
  if (activatorEvent instanceof TouchEvent && activatorEvent.touches[0]) {
    return activatorEvent.touches[0].clientY + delta.y;
  }

  return null;
}

export function resolveTicketBoardInsertionTarget({
  event,
  reportsByStatus,
  visibleCountByStatus,
}: ResolveTicketBoardInsertionTargetInput): TicketBoardInsertionTarget | null {
  const { over } = event;
  if (!over) {
    return null;
  }

  const pointerY = getDragPointerY(event);
  const overId = String(over.id);
  const statusFromColumn = ticketBoardStatuses.find((status) => status === overId);

  if (statusFromColumn) {
    const visibleReports = visibleReportsForStatus(reportsByStatus, visibleCountByStatus, statusFromColumn);
    const index = insertionIndexInColumn({
      event,
      pointerY,
      visibleReports,
      keyboardFocusIndex: null,
    });
    return { status: statusFromColumn, index };
  }

  for (const status of ticketBoardStatuses) {
    const visibleReports = visibleReportsForStatus(reportsByStatus, visibleCountByStatus, status);
    const overIndex = visibleReports.findIndex((report) => report.id === overId);
    if (overIndex === -1) {
      continue;
    }

    const index = insertionIndexInColumn({
      event,
      pointerY,
      visibleReports,
      keyboardFocusIndex: pointerY === null ? overIndex : null,
    });
    return { status, index };
  }

  return null;
}

type InsertionIndexInColumnInput = {
  event: DragOverEvent;
  pointerY: number | null;
  visibleReports: BugReportModelType[];
  keyboardFocusIndex: number | null;
};

function insertionIndexInColumn({
  event,
  pointerY,
  visibleReports,
  keyboardFocusIndex,
}: InsertionIndexInColumnInput): number {
  if (visibleReports.length === 0) {
    return 0;
  }

  if (pointerY !== null) {
    for (let index = 0; index < visibleReports.length; index++) {
      const report = visibleReports[index];
      if (!report) {
        continue;
      }
      const rect = droppableRectForId(event, report.id);
      if (!rect) {
        continue;
      }
      const midY = rect.top + rect.height / 2;
      if (pointerY < midY) {
        return index;
      }
    }
    return visibleReports.length;
  }

  if (keyboardFocusIndex !== null) {
    return keyboardFocusIndex;
  }

  return visibleReports.length;
}

function droppableRectForId(event: DragOverEvent, id: string): ClientRect | null {
  if (String(event.active.id) === id) {
    return event.active.rect.current.initial;
  }

  const collision = event.collisions?.find((entry) => String(entry.id) === id);
  const container = collision?.data?.droppableContainer;
  if (container?.rect.current) {
    return container.rect.current;
  }
  if (event.over && String(event.over.id) === id && event.over.rect) {
    return event.over.rect;
  }
  return null;
}

function visibleReportsForStatus(
  reportsByStatus: Map<BugReportStatus, BugReportModelType[]>,
  visibleCountByStatus: Record<BugReportStatus, number>,
  status: BugReportStatus,
): BugReportModelType[] {
  const reports = reportsByStatus.get(status) ?? [];
  return reports.slice(0, visibleCountByStatus[status]);
}
