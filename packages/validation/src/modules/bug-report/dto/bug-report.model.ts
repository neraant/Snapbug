import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { z } from "zod";

export const bugReportModelSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  assignedTo: z.uuid().nullable(),
  status: z.enum(BugReportStatus),
  severity: z.enum(BugReportSeverity),
  title: z.string(),
  description: z.string(),
  stepsToReproduce: z.string().nullable(),
  reporterEmail: z.email().nullable(),
  url: z.url().nullable(),
  userAgent: z.string().nullable(),
  browser: z.string().nullable(),
  os: z.string().nullable(),
  device: z.string().nullable(),
  viewportWidth: z.int().nullable(),
  viewportHeight: z.int().nullable(),
  hasReplay: z.boolean(),
  consoleLogs: z.array(z.unknown()).nullable(),
  networkLogs: z.array(z.unknown()).nullable(),
  customContext: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type BugReportModelType = z.infer<typeof bugReportModelSchema>;
