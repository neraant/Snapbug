import { BUG_REPORT_CUSTOM_CONTEXT_MAX_BYTES } from "@workspace/validation/modules/bug-report/consts/bug-report-custom-context.const";
import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import {
  BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES,
  BUG_REPORT_NETWORK_LOG_MAX_ENTRIES,
  bugReportConsoleLogEntrySchema,
  bugReportNetworkLogEntrySchema,
} from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import { z } from "zod";

export { BUG_REPORT_CUSTOM_CONTEXT_MAX_BYTES } from "@workspace/validation/modules/bug-report/consts/bug-report-custom-context.const";
export { BUG_REPORT_REPLAY_MAX_BYTES } from "@workspace/validation/modules/bug-report/consts/bug-report-replay.const";
export { BUG_REPORT_SCREENSHOT_MAX_BYTES } from "@workspace/validation/modules/bug-report/consts/bug-report-screenshot.const";

export const bugReportReporterSeveritySchema = z.enum(["low", "high", "critical"]);

export const bugReportCustomContextInputSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => JSON.stringify(value).length <= BUG_REPORT_CUSTOM_CONTEXT_MAX_BYTES, {
    message: `customContext must be at most ${BUG_REPORT_CUSTOM_CONTEXT_MAX_BYTES} bytes when serialized`,
  });

export const createBugReportInputDtoSchema = bugReportModelSchema
  .pick({ title: true, description: true, url: true })
  .extend({
    apiKey: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.url(),
    userAgent: z.string().optional(),
    viewportWidth: z.int().optional(),
    viewportHeight: z.int().optional(),
    reporterEmail: bugReportModelSchema.shape.reporterEmail.nullish(),
    customContext: bugReportCustomContextInputSchema.nullish(),
    consoleLogs: z.array(bugReportConsoleLogEntrySchema).max(BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES).optional(),
    networkLogs: z.array(bugReportNetworkLogEntrySchema).max(BUG_REPORT_NETWORK_LOG_MAX_ENTRIES).optional(),
    severity: bugReportReporterSeveritySchema.optional(),
  });

export type CreateBugReportInputDtoType = z.infer<typeof createBugReportInputDtoSchema>;

export const createBugReportOutputDtoSchema = bugReportModelSchema;

export type CreateBugReportOutputDtoType = z.infer<typeof createBugReportOutputDtoSchema>;

export const BUG_REPORT_SCREENSHOT_FORM_FIELD = "screenshot" as const;
export const BUG_REPORT_REPLAY_FORM_FIELD = "replay" as const;

const optionalMultipartInt = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined || value.trim().length === 0) return undefined;
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return undefined;
    return parsed;
  });

export const createBugReportMultipartFieldsSchema = createBugReportInputDtoSchema
  .omit({ viewportWidth: true, viewportHeight: true, consoleLogs: true, networkLogs: true, customContext: true })
  .extend({
    viewportWidth: optionalMultipartInt,
    viewportHeight: optionalMultipartInt,
    consoleLogsJson: z.string().optional(),
    networkLogsJson: z.string().optional(),
    customContextJson: z.string().optional(),
  });

export type CreateBugReportMultipartFieldsType = z.infer<typeof createBugReportMultipartFieldsSchema>;
