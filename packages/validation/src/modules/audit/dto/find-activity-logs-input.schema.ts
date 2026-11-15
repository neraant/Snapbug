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
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  search: z.string().trim().max(200).optional(),
  actorId: z.uuid().optional(),
  entityType: activityLogEntityTypeFilterSchema.optional(),
  range: activityLogDateRangeSchema.optional(),
});

export type FindActivityLogsInputDtoType = z.infer<typeof findActivityLogsInputDtoSchema>;
export type ActivityLogDateRangeType = z.infer<typeof activityLogDateRangeSchema>;
export type ActivityLogEntityTypeFilterType = z.infer<typeof activityLogEntityTypeFilterSchema>;
