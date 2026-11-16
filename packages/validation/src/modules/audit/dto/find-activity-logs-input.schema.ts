import { z } from "zod";

export const activityLogDateRangeSchema = z.enum(["24h", "7d", "30d", "all"]);

export const activityLogEntityTypeFilterSchema = z.enum([
  "bug-report",
  "project",
  "membership",
  "invitation",
  "api-key",
  "organization",
]);

export const findActivityLogsInputDtoSchema = z.object({
  cursor: z.string().trim().min(1).optional().describe("Opaque cursor from a previous list_activity response."),
  limit: z.coerce.number().int().min(1).max(50).optional().describe("Page size; default 50, maximum 50."),
  search: z.string().trim().max(200).optional().describe("Free-text filter on activity details."),
  actorId: z.uuid().optional().describe("Filter by actor user id."),
  entityType: activityLogEntityTypeFilterSchema.optional().describe("Filter by entity kind."),
  range: activityLogDateRangeSchema.optional().describe("Relative time window for results."),
});

export type FindActivityLogsInputDtoType = z.infer<typeof findActivityLogsInputDtoSchema>;
export type ActivityLogDateRangeType = z.infer<typeof activityLogDateRangeSchema>;
export type ActivityLogEntityTypeFilterType = z.infer<typeof activityLogEntityTypeFilterSchema>;
