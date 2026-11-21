import { notificationPreferenceGroupSchema } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { notificationPreferenceChannelSchema } from "@workspace/validation/modules/notification/dto/notification-preference-channel.schema";
import { notificationPreferenceDefaultChannels } from "@workspace/validation/modules/notification/utils/notification-type-preference-group.util";
import { z } from "zod";

export const notificationPreferenceDefaults = {
  channels: notificationPreferenceDefaultChannels,
  mutedProjectIds: [],
} as const;

export const notificationPreferenceModelDefaultLockedGroups = ["security"] as const;

export const notificationPreferenceModelSchema = z.object({
  channels: z.partialRecord(notificationPreferenceGroupSchema, notificationPreferenceChannelSchema),
  mutedProjectIds: z.array(z.string().uuid()),
  lockedGroups: z.array(notificationPreferenceGroupSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type NotificationPreferenceModelType = z.infer<typeof notificationPreferenceModelSchema>;