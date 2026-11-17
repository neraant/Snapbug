import { notificationPreferenceModelSchema } from "@workspace/validation/modules/notification/dto/notification-preference.model";
import type { z } from "zod";

export const findNotificationPreferenceOutputDtoSchema = notificationPreferenceModelSchema;

export type FindNotificationPreferenceOutputDtoType = z.infer<typeof findNotificationPreferenceOutputDtoSchema>;