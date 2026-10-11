import { bugReportStatIds } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-id.const";
import { bugReportStatPeriodDays } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";
import { z } from "zod";

const bugReportStatPeriodDaysSchema = z.union(
  bugReportStatPeriodDays.map((days) => z.literal(days)) as [z.ZodLiteral<7>, z.ZodLiteral<30>, z.ZodLiteral<90>],
);

const bugReportStatSparklinePointSchema = z.object({
  value: z.number(),
});

export const bugReportStatItemSchema = z.object({
  id: z.enum(bugReportStatIds),
  value: z.string(),
  changePercent: z.number(),
  sparkline: z.array(bugReportStatSparklinePointSchema).length(7),
});

export const findStatsInputDtoSchema = z.object({
  organizationId: z.uuid(),
  projectId: z.uuid().optional(),
  periodDays: bugReportStatPeriodDaysSchema,
});

export type FindStatsInputDtoType = z.infer<typeof findStatsInputDtoSchema>;

export const findStatsOutputDtoSchema = z.object({
  items: z.array(bugReportStatItemSchema),
});

export type FindStatsOutputDtoType = z.infer<typeof findStatsOutputDtoSchema>;
