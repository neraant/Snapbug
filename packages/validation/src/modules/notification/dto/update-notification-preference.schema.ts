import { notificationPreferenceGroups } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { notificationPreferenceModelSchema } from "@workspace/validation/modules/notification/dto/notification-preference.model";
import { notificationPreferenceChannelSchema } from "@workspace/validation/modules/notification/dto/notification-preference-channel.schema";
import { z } from "zod";

const notificationPreferenceGroupSchema = z.enum(notificationPreferenceGroups);

const channelPatchSchema = notificationPreferenceChannelSchema.partial();

export const updateNotificationPreferenceInputDtoSchema = z
  .object({
    channels: z.partialRecord(notificationPreferenceGroupSchema, channelPatchSchema).optional(),
    mutedProjectIds: z.array(z.uuid()).optional(),
  })
  .refine((value) => value.channels !== undefined || value.mutedProjectIds !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateNotificationPreferenceInputDtoType = z.infer<typeof updateNotificationPreferenceInputDtoSchema>;

export const updateNotificationPreferenceOutputDtoSchema = notificationPreferenceModelSchema;

export type UpdateNotificationPreferenceOutputDtoType = z.infer<typeof updateNotificationPreferenceOutputDtoSchema>;