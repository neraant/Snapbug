import { bugReportStatuses } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { z } from "zod";

const bugReportStatusSchema = z.enum(bugReportStatuses);

const bugReportBreakdownCountItemSchema = z.object({
  label: z.string(),
  count: z.number(),
});

const bugReportBreakdownStatusItemSchema = z.object({
  status: bugReportStatusSchema,
  count: z.number(),
});

const bugReportBreakdownEnvironmentSchema = z.object({
  total: z.number(),
  items: z.array(bugReportBreakdownCountItemSchema),
});

export const findBreakdownsInputDtoSchema = findStatsInputDtoSchema;

export type FindBreakdownsInputDtoType = z.infer<typeof findBreakdownsInputDtoSchema>;

export const findBreakdownsOutputDtoSchema = z.object({
  status: z.array(bugReportBreakdownStatusItemSchema),
  pages: z.array(bugReportBreakdownCountItemSchema),
  browser: bugReportBreakdownEnvironmentSchema,
  os: bugReportBreakdownEnvironmentSchema,
  device: bugReportBreakdownEnvironmentSchema,
});

export type FindBreakdownsOutputDtoType = z.infer<typeof findBreakdownsOutputDtoSchema>;
