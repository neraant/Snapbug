import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { z } from "zod";

const bugReportBreakdownCountItemSchema = z.object({
  label: z.string(),
  count: z.number(),
});

const bugReportBreakdownStatusItemSchema = bugReportModelSchema.pick({ status: true }).extend({
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
