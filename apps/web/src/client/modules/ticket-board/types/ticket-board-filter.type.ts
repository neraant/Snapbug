import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import type { ticketBoardPeriodDays } from "@/client/modules/ticket-board/consts/ticket-board.const";

export type TicketBoardPeriodDays =
  | (typeof ticketBoardPeriodDays)["all"]
  | (typeof ticketBoardPeriodDays)["last7"]
  | (typeof ticketBoardPeriodDays)["last30"]
  | (typeof ticketBoardPeriodDays)["last90"];

export type TicketBoardFilters = {
  search: string;
  severities: BugReportSeverity[];
  statuses: BugReportStatus[];
  periodDays: TicketBoardPeriodDays;
};
