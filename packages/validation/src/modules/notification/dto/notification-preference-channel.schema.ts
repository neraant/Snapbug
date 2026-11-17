import { z } from "zod";

export const notificationPreferenceChannelSchema = z.object({
  inApp: z.boolean(),
  email: z.boolean(),
});

export type NotificationPreferenceChannelType = z.infer<typeof notificationPreferenceChannelSchema>;