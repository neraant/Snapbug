import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { z } from "zod";

export const findChartsInputDtoSchema = findStatsInputDtoSchema;

export type FindChartsInputDtoType = z.infer<typeof findChartsInputDtoSchema>;

const bugReportChartPointSchema = z.object({
  day: z.string(),
  created: z.number(),
  resolved: z.number(),
});

const bugReportChartSeverityCountSchema = bugReportModelSchema.pick({ severity: true }).extend({
  count: z.number(),
});

const bugReportChartHourCellSchema = z.object({
  weekday: z.number().int().min(1).max(7),
  hour: z.number().int().min(0).max(23),
  count: z.number(),
});

export const findChartsOutputDtoSchema = z.object({
  points: z.array(bugReportChartPointSchema),
  severity: z.array(bugReportChartSeverityCountSchema),
  hours: z.array(bugReportChartHourCellSchema).length(168),
});

export type FindChartsOutputDtoType = z.infer<typeof findChartsOutputDtoSchema>;
