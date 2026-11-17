import { z } from "zod";

export const notificationPayloadSchema = z.object({
  ticketShortId: z.string().optional(),
  ticketTitle: z.string().optional(),
  projectName: z.string().optional(),
  projectSlug: z.string().optional(),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  count: z.number().int().positive().optional(),
  actorName: z.string().optional(),
  memberName: z.string().optional(),
  tokenName: z.string().optional(),
  restored: z.boolean().optional(),
});

export type NotificationPayloadType = z.infer<typeof notificationPayloadSchema>;