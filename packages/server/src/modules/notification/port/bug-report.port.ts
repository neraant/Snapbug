import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

export type NotificationBugReportPort = {
  findById(id: string): Promise<BugReportModelType | null>;
};
