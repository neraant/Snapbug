"use client";

import { useEffect } from "react";

import { TicketBoard } from "@/client/modules/ticket-board/components/ticket-board";
import { useTicketBoard } from "@/client/modules/ticket-board/hooks/use-ticket-board";
import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";

type TicketBoardBodyProps = {
  projectId: string | null;
  filters: TicketBoardFilters;
  onClearFilters: VoidFunction;
  onFilteredCountChange: (count: number) => void;
};

export function TicketBoardBody({ projectId, filters, onClearFilters, onFilteredCountChange }: TicketBoardBodyProps) {
  const board = useTicketBoard({ projectId, filters });

  useEffect(() => {
    onFilteredCountChange(board.filteredReports.length);
  }, [board.filteredReports.length, onFilteredCountChange]);

  return <TicketBoard projectId={projectId} onClearFilters={onClearFilters} board={board} />;
}
