import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

import { sortTicketBoardColumnReports } from "@/client/modules/ticket-board/utils/sort-ticket-board-column-reports.util";

const ticketBoardOrderStep = 1024;

export function computeTicketBoardBoardOrder(
  columnReports: BugReportModelType[],
  activeReportId: string,
  insertionIndex: number,
): number {
  const sortedColumn = sortTicketBoardColumnReports(columnReports);
  const activeIndex = sortedColumn.findIndex((report) => report.id === activeReportId);
  const siblings = sortedColumn.filter((report) => report.id !== activeReportId);

  let targetIndex = insertionIndex;
  if (activeIndex !== -1 && activeIndex < insertionIndex) {
    targetIndex = insertionIndex - 1;
  }

  if (siblings.length === 0) {
    return ticketBoardOrderStep;
  }

  const firstSibling = siblings[0];
  const lastSibling = siblings[siblings.length - 1];
  if (targetIndex <= 0 && firstSibling) {
    return firstSibling.boardOrder - ticketBoardOrderStep;
  }

  if (targetIndex >= siblings.length && lastSibling) {
    return lastSibling.boardOrder + ticketBoardOrderStep;
  }

  const previous = siblings[targetIndex - 1];
  const next = siblings[targetIndex];
  if (previous && next && next.boardOrder - previous.boardOrder > 1) {
    return Math.floor((previous.boardOrder + next.boardOrder) / 2);
  }

  return (targetIndex + 1) * ticketBoardOrderStep;
}
