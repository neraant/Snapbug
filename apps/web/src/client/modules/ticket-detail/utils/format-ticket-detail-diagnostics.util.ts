import type { BugReportConsoleLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import type { BugReportNetworkLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";

type TicketDetailLogTone = "neutral" | "info" | "warning" | "error" | "success";

export type TicketDetailLogEntry = {
  key: string;
  tone?: TicketDetailLogTone;
  label?: string;
  labelAs?: "badge" | "text";
  message: string;
  meta?: string;
};

const logClockFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function isConsoleLogEntry(value: unknown): value is BugReportConsoleLogEntryType {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.level === "string" && typeof entry.message === "string" && typeof entry.timestamp === "string";
}

function isNetworkLogEntry(value: unknown): value is BugReportNetworkLogEntryType {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.method === "string" &&
    typeof entry.url === "string" &&
    typeof entry.status === "number" &&
    typeof entry.durationMs === "number"
  );
}

export function formatTicketDetailConsoleLogs(logs: unknown[] | null): TicketDetailLogEntry[] {
  if (!logs || logs.length === 0) return [];

  return logs.map((entry, index) => {
    if (!isConsoleLogEntry(entry)) {
      return {
        key: `console-${index}`,
        tone: "neutral",
        label: "log",
        message: JSON.stringify(entry, null, 2),
      };
    }

    return {
      key: `console-${index}`,
      tone: consoleTone(entry.level),
      label: entry.level,
      message: entry.message,
      meta: formatLogClock(entry.timestamp),
    };
  });
}

export function formatTicketDetailNetworkLogs(logs: unknown[] | null): TicketDetailLogEntry[] {
  if (!logs || logs.length === 0) return [];

  return logs.map((entry, index) => {
    if (!isNetworkLogEntry(entry)) {
      return {
        key: `network-${index}`,
        tone: "neutral",
        label: "req",
        message: JSON.stringify(entry, null, 2),
      };
    }

    return {
      key: `network-${index}`,
      tone: networkTone(entry.status),
      label: `${entry.method} ${entry.status}`,
      message: entry.url,
      meta: `${Math.round(entry.durationMs)}ms`,
    };
  });
}

export function formatTicketDetailCustomContext(context: Record<string, unknown> | null): TicketDetailLogEntry[] {
  if (!context || Object.keys(context).length === 0) return [];

  const entries: TicketDetailLogEntry[] = [];
  flattenContext(context, "", entries);
  return entries;
}

function flattenContext(value: unknown, prefix: string, entries: TicketDetailLogEntry[]) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length === 0 && prefix.length > 0) {
      entries.push({ key: prefix, tone: "neutral", label: prefix, labelAs: "text", message: "{}" });
      return;
    }
    for (const key of keys) {
      flattenContext(record[key], prefix.length > 0 ? `${prefix}.${key}` : key, entries);
    }
    return;
  }

  entries.push({
    key: prefix || "context",
    tone: "neutral",
    label: prefix || "value",
    labelAs: "text",
    message: formatContextValue(value),
  });
}

function formatContextValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || value == null) return String(value);
  return JSON.stringify(value, null, 2);
}

function consoleTone(level: string): TicketDetailLogTone {
  if (level === "error") return "error";
  if (level === "warn") return "warning";
  if (level === "info") return "info";
  return "neutral";
}

function networkTone(status: number): TicketDetailLogTone {
  if (status >= 500 || status === 0) return "error";
  if (status >= 400) return "warning";
  if (status >= 200 && status < 300) return "success";
  return "info";
}

function formatLogClock(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return logClockFormat.format(date);
}
