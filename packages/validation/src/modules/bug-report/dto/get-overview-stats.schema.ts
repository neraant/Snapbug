import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { z } from "zod";

const overviewCountSchema = z.object({
  label: z.string(),
  count: z.number().int(),
});

export const getOverviewStatsInputDtoSchema = z.object({
  projectId: z.uuid().optional().describe("Count within one project; omit to aggregate all accessible projects."),
  organizationId: z.uuid().optional().describe("Organization scope when the caller belongs to several teams."),
});

export type GetOverviewStatsInputDtoType = z.infer<typeof getOverviewStatsInputDtoSchema>;

export const getOverviewStatsOutputDtoSchema = z.object({
  byStatus: z.array(
    overviewCountSchema.extend({
      label: z.enum(BugReportStatus),
    }),
  ),
  bySeverity: z.array(
    overviewCountSchema.extend({
      label: z.enum(BugReportSeverity),
    }),
  ),
});

export type GetOverviewStatsOutputDtoType = z.infer<typeof getOverviewStatsOutputDtoSchema>;
