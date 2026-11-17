import type { BugReportAdapter } from "@workspace/server/modules/bug-report/adapter/bug-report.adapter";
import type { NotificationBugReportPort } from "@workspace/server/modules/notification/port/bug-report.port";

export class NotificationBugReportAdapter implements NotificationBugReportPort {
  constructor(private readonly bugReportAdapter: BugReportAdapter) {}

  async findById(id: string) {
    return await this.bugReportAdapter.findById(id);
  }
}