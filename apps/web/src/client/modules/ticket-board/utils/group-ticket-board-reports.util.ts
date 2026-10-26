import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

import { ticketBoardStatuses } from "@/client/modules/ticket-board/consts/ticket-board.const";
import { sortTicketBoardColumnReports } from "@/client/modules/ticket-board/utils/sort-ticket-board-column-reports.util";

export function groupTicketBoardReportsByStatus(reports: BugReportModelType[]) {
  const grouped = new Map<BugReportStatus, BugReportModelType[]>(ticketBoardStatuses.map((status) => [status, []]));

  for (const report of reports) {
    const column = grouped.get(report.status);
    if (column) {
      column.push(report);
    }
  }

  for (const status of ticketBoardStatuses) {
    const column = grouped.get(status);
    if (column) {
      grouped.set(status, sortTicketBoardColumnReports(column));
    }
  }

  return grouped;
}
