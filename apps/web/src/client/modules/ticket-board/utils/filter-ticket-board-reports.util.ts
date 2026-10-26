import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";

export function filterTicketBoardReports(
  reports: BugReportModelType[],
  filters: TicketBoardFilters,
): BugReportModelType[] {
  const search = filters.search.trim().toLowerCase();

  return reports.filter((report) => {
    if (search) {
      const matchesTitle = report.title.toLowerCase().includes(search);
      const matchesShortId = report.shortId.toLowerCase().includes(search);
      if (!matchesTitle && !matchesShortId) {
        return false;
      }
    }

    if (filters.severities.length > 0 && !filters.severities.includes(report.severity)) {
      return false;
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(report.status)) {
      return false;
    }

    if (filters.periodDays) {
      const cutoff = Date.now() - filters.periodDays * 86_400_000;
      if (new Date(report.createdAt).getTime() < cutoff) {
        return false;
      }
    }

    return true;
  });
}

export function hasActiveTicketBoardFilters(filters: TicketBoardFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.severities.length > 0 ||
    filters.statuses.length > 0 ||
    filters.periodDays !== null
  );
}
