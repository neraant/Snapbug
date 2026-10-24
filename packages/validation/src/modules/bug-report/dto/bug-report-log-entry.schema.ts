import { z } from "zod";

/** Mirrors SDK collector limits (`bug-report-collector.const.ts`). */
export const BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES = 50;
export const BUG_REPORT_NETWORK_LOG_MAX_ENTRIES = 30;
export const BUG_REPORT_LOG_MESSAGE_MAX_LENGTH = 2_000;

export const bugReportConsoleLogEntrySchema = z.object({
  level: z.enum(["log", "info", "warn", "error"]),
  message: z.string().max(BUG_REPORT_LOG_MESSAGE_MAX_LENGTH),
  timestamp: z.iso.datetime(),
});

export type BugReportConsoleLogEntryType = z.infer<typeof bugReportConsoleLogEntrySchema>;

export const bugReportNetworkLogEntrySchema = z.object({
  method: z.string().min(1),
  url: z.string().min(1),
  status: z.int(),
  durationMs: z.number(),
});

export type BugReportNetworkLogEntryType = z.infer<typeof bugReportNetworkLogEntrySchema>;
