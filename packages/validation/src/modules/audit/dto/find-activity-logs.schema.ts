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
  actorId: z.uuid().nullable(),
  actorName: z.string().nullable(),
  actorLabel: z.string(),
  entityType: z.string(),
  entityId: z.uuid(),
  entityLabel: z.string(),
  entityExists: z.boolean(),
  entityShortId: z.string().nullable(),
  projectId: z.uuid().nullable(),
  action: z.string(),
  source: z.enum(activityLogSources),
  changes: z.array(activityLogChangeSchema),
});

export const findActivityLogsOutputDtoSchema = z.object({
  items: z.array(activityLogSchema),
  nextCursor: z.string().nullable(),
});

export type ActivityLogType = z.infer<typeof activityLogSchema>;
export type FindActivityLogsOutputDtoType = z.infer<typeof findActivityLogsOutputDtoSchema>;
