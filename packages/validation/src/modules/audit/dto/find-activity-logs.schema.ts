import { z } from "zod";

const activityLogSources = ["web", "mcp"] as const;

export const activityLogChangeSchema = z.object({
  field: z.string(),
  from: z.string().nullable(),
  to: z.string().nullable(),
});

export const activityLogSchema = z.object({
  id: z.uuid(),
  occurredAt: z.iso.datetime(),
  actorLabel: z.string(),
  entityType: z.string(),
  entityId: z.uuid(),
  action: z.string(),
  source: z.enum(activityLogSources),
  changes: z.array(activityLogChangeSchema),
});

export const findActivityLogsOutputDtoSchema = z.array(activityLogSchema);

export type ActivityLogType = z.infer<typeof activityLogSchema>;
export type FindActivityLogsOutputDtoType = z.infer<typeof findActivityLogsOutputDtoSchema>;
