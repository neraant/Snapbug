import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

export function sortTicketBoardColumnReports(reports: BugReportModelType[]): BugReportModelType[] {
  return [...reports].sort((left, right) => {
    if (left.boardOrder !== right.boardOrder) {
      return left.boardOrder - right.boardOrder;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
