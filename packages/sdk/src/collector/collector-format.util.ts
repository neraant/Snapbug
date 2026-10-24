import { BUG_REPORT_LOG_MESSAGE_MAX_LENGTH } from "./collector.const";

export function formatConsoleArgs(args: unknown[]): string {
  const parts = args.map((arg) => {
    if (typeof arg === "string") return arg;
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  });
  const joined = parts.join(" ");
  if (joined.length <= BUG_REPORT_LOG_MESSAGE_MAX_LENGTH) return joined;
  return `${joined.slice(0, BUG_REPORT_LOG_MESSAGE_MAX_LENGTH - 1)}…`;
}

export function formatErrorMessage(event: ErrorEvent): string {
  const parts: string[] = [];
  if (event.message) parts.push(event.message);
  if (event.filename) parts.push(`at ${event.filename}:${event.lineno}:${event.colno}`);
  if (event.error?.stack) parts.push(String(event.error.stack));
  return formatConsoleArgs(parts);
}

export function formatRejectionReason(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.stack ?? reason.message;
  }
  if (typeof reason === "string") return reason;
  try {
    return JSON.stringify(reason);
  } catch {
    return String(reason);
  }
}
