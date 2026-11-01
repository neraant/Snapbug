"use client";

import { Column } from "@workspace/design-system/components/layout/column";

import { TicketBoard } from "@/client/modules/ticket-board/components/ticket-board";
import { useTicketBoard } from "@/client/modules/ticket-board/hooks/use-ticket-board";
import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";

type TicketBoardBodyProps = {
  projectId: string | null;
  filters: TicketBoardFilters;
  onClearFilters: VoidFunction;
};

export function TicketBoardBody({ projectId, filters, onClearFilters }: TicketBoardBodyProps) {
  const board = useTicketBoard({ projectId, filters });

  return (
    <Column minWidth="0" width="full" className="flex min-h-0 flex-1 flex-col">
      <TicketBoard projectId={projectId} onClearFilters={onClearFilters} board={board} />
    </Column>
  );
}
