import { bugReportSeverities } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { z } from "zod";

const bugReportSeveritySchema = z.enum(bugReportSeverities);

export const findChartsInputDtoSchema = findStatsInputDtoSchema;

export type FindChartsInputDtoType = z.infer<typeof findChartsInputDtoSchema>;

const bugReportChartPointSchema = z.object({
  day: z.string(),
  created: z.number(),
  resolved: z.number(),
});

const bugReportChartSeverityCountSchema = z.object({
  severity: bugReportSeveritySchema,
  count: z.number(),
});

export const findChartsOutputDtoSchema = z.object({
  points: z.array(bugReportChartPointSchema),
  severity: z.array(bugReportChartSeverityCountSchema),
});

export type FindChartsOutputDtoType = z.infer<typeof findChartsOutputDtoSchema>;
