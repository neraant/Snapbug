import {
  closestCorners,
  DndContext,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { TooltipProvider } from "@workspace/design-system/components/ui/tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { TicketBoardCard } from "@/client/modules/ticket-board/components/ticket-board-card";
import { TicketBoardColumn } from "@/client/modules/ticket-board/components/ticket-board-column";
import { TicketBoardEmpty } from "@/client/modules/ticket-board/components/ticket-board-empty";
import {
  ticketBoardCardHeightClass,
  ticketBoardStatuses,
} from "@/client/modules/ticket-board/consts/ticket-board.const";
import type { useTicketBoard } from "@/client/modules/ticket-board/hooks/use-ticket-board";
import {
  resolveTicketBoardInsertionTarget,
  type TicketBoardInsertionTarget,
} from "@/client/modules/ticket-board/utils/resolve-ticket-board-insertion-target.util";

type TicketBoardProps = {
  projectId: string | null;
  onClearFilters: () => void;
  board: ReturnType<typeof useTicketBoard>;
};

export function TicketBoard({ projectId, onClearFilters, board }: TicketBoardProps) {
  const { data: projects } = useFindProjects();
  const projectNameById = useMemo(() => new Map(projects.map((project) => [project.id, project.name])), [projects]);
  const showProjectName = projectId === null;

  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [insertionTarget, setInsertionTarget] = useState<TicketBoardInsertionTarget | null>(null);

  useEffect(() => {
    setIsDragEnabled(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      setInsertionTarget(
        resolveTicketBoardInsertionTarget({
          event,
          reportsByStatus: board.reportsByStatus,
          visibleCountByStatus: board.visibleCountByStatus,
        }),
      );
    },
    [board.reportsByStatus, board.visibleCountByStatus],
  );

  const clearDragState = useCallback(() => {
    setActiveDragId(null);
    setInsertionTarget(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const dropInsertionTarget = insertionTarget;
      clearDragState();
      board.onDragEnd(event, dropInsertionTarget);
    },
    [board, clearDragState, insertionTarget],
  );

  const handleDragCancel = useCallback(
    (_event: DragCancelEvent) => {
      clearDragState();
    },
    [clearDragState],
  );

  const collisionDetection = useCallback((args: Parameters<typeof pointerWithin>[0]) => {
    const corners = closestCorners(args);
    const pointerCollisions = pointerWithin(args);
    const preferred =
      pointerCollisions.find((collision) => !ticketBoardStatuses.some((status) => status === collision.id)) ??
      pointerCollisions.find((collision) => ticketBoardStatuses.some((status) => status === collision.id));

    if (!preferred) {
      return corners;
    }

    return [preferred, ...corners.filter((collision) => collision.id !== preferred.id)];
  }, []);

  const activeReport = useMemo(() => {
    if (!activeDragId) {
      return null;
    }
    for (const reports of board.reportsByStatus.values()) {
      const match = reports.find((report) => report.id === activeDragId);
      if (match) {
        return match;
      }
    }
    return null;
  }, [activeDragId, board.reportsByStatus]);

  const columns = (
    <TicketBoardColumnRow
      board={board}
      projectNameById={projectNameById}
      showProjectName={showProjectName}
      dragEnabled={isDragEnabled}
      activeDragId={activeDragId}
      insertionTarget={insertionTarget}
    />
  );

  return (
    <Column gap="lg" minWidth="0" width="full" className="flex min-h-0 flex-1 flex-col">
      {board.isEmpty ? (
        <TicketBoardEmpty variant="no-reports" projectId={projectId} onClearFilters={onClearFilters} />
      ) : null}
      {board.isFilteredEmpty ? (
        <TicketBoardEmpty variant="filtered" projectId={projectId} onClearFilters={onClearFilters} />
      ) : null}
      {!board.isEmpty && !board.isFilteredEmpty ? (
        <TooltipProvider>
          {isDragEnabled ? (
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetection}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              {columns}
              <DragOverlay dropAnimation={null}>
                {activeReport ? (
                  <TicketBoardCard
                    report={activeReport}
                    projectName={showProjectName ? projectNameById.get(activeReport.projectId) : undefined}
                    dragEnabled={false}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            columns
          )}
        </TooltipProvider>
      ) : null}
    </Column>
  );
}

type TicketBoardColumnRowProps = {
  board: ReturnType<typeof useTicketBoard>;
  projectNameById: Map<string, string>;
  showProjectName: boolean;
  dragEnabled: boolean;
  activeDragId: string | null;
  insertionTarget: TicketBoardInsertionTarget | null;
};

function TicketBoardColumnRow({
  board,
  projectNameById,
  showProjectName,
  dragEnabled,
  activeDragId,
  insertionTarget,
}: TicketBoardColumnRowProps) {
  return (
    <Column minWidth="0" width="full" className="min-h-0 flex-1 overflow-x-auto pb-4">
      <Row gap="lg" wrap={false} align="stretch" className="h-full min-h-0 w-full min-w-min">
        {board.visibleStatuses.map((status) => (
          <TicketBoardColumn
            key={status}
            status={status}
            reports={board.reportsByStatus.get(status) ?? []}
            visibleCount={board.visibleCountByStatus[status]}
            projectNameById={projectNameById}
            showProjectName={showProjectName}
            onLoadMore={() => board.loadMore(status)}
            dragEnabled={dragEnabled}
            isDraggingTicket={dragEnabled && activeDragId !== null}
            insertionIndex={insertionTarget?.status === status ? insertionTarget.index : null}
          />
        ))}
      </Row>
    </Column>
  );
}

function TicketBoardFallback() {
  return (
    <Column minWidth="0" width="full" className="overflow-x-auto">
      <Row gap="lg" wrap={false} align="stretch" className="w-full min-w-min">
        {ticketBoardStatuses.map((status) => (
          <Column key={status} gap="sm" minWidth="lg" className="w-full max-w-80 min-w-80 flex-1 shrink-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className={`${ticketBoardCardHeightClass} w-full`} />
            <Skeleton className={`${ticketBoardCardHeightClass} w-full`} />
            <Skeleton className={`${ticketBoardCardHeightClass} w-full`} />
          </Column>
        ))}
      </Row>
    </Column>
  );
}

TicketBoard.Fallback = TicketBoardFallback;
