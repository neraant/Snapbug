import type {
  BugReportConsoleLogEntryType,
  BugReportNetworkLogEntryType,
} from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";

import { BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES, BUG_REPORT_NETWORK_LOG_MAX_ENTRIES } from "./collector.const";

const consoleBuffer: BugReportConsoleLogEntryType[] = [];
const networkBuffer: BugReportNetworkLogEntryType[] = [];

export function pushConsoleEntry(entry: BugReportConsoleLogEntryType) {
  consoleBuffer.push(entry);
  while (consoleBuffer.length > BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES) {
    consoleBuffer.shift();
  }
}

export function pushNetworkEntry(entry: BugReportNetworkLogEntryType) {
  networkBuffer.push(entry);
  while (networkBuffer.length > BUG_REPORT_NETWORK_LOG_MAX_ENTRIES) {
    networkBuffer.shift();
  }
}

export function snapshotCollectorBuffers(): {
  consoleLogs: BugReportConsoleLogEntryType[];
  networkLogs: BugReportNetworkLogEntryType[];
} {
  return {
    consoleLogs: consoleBuffer.map((entry) => ({ ...entry })),
    networkLogs: networkBuffer.map((entry) => ({ ...entry })),
  };
}

export function clearCollectorBuffers() {
  consoleBuffer.length = 0;
  networkBuffer.length = 0;
}
