import type { LogViewerEntry } from "@workspace/design-system/components/ui/log-viewer";
import type { BugReportConsoleLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import type { BugReportNetworkLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";

export function formatPlaygroundConsoleLogs(logs: BugReportConsoleLogEntryType[] | undefined): LogViewerEntry[] {
  if (!logs || logs.length === 0) return [];

  return logs.map((entry, index) => ({
    key: `console-${index}`,
    tone: entry.level === "error" ? "error" : entry.level === "warn" ? "warning" : "neutral",
    label: entry.level,
    message: entry.message,
  }));
}

export function formatPlaygroundNetworkLogs(logs: BugReportNetworkLogEntryType[] | undefined): LogViewerEntry[] {
  if (!logs || logs.length === 0) return [];

  return logs.map((entry, index) => ({
    key: `network-${index}`,
    tone: entry.status >= 400 ? "error" : "neutral",
    label: `${entry.method} ${entry.status}`,
    message: entry.url,
    meta: `${Math.round(entry.durationMs)}ms`,
  }));
}
