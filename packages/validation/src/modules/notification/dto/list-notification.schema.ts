import { z } from "zod";
import { notificationListFilters } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import { notificationTypes } from "@workspace/validation/modules/notification/consts/notification-type.const";
import { notificationModelSchema } from "@workspace/validation/modules/notification/dto/notification.model";

export const listNotificationInputDtoSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  filter: z.enum(notificationListFilters).optional(),
  types: z.array(z.enum(notificationTypes)).optional(),
});

export const listNotificationOutputDtoSchema = z.object({
  items: z.array(notificationModelSchema),
  nextCursor: z.string().nullable(),
});

export type ListNotificationInputDtoType = z.infer<typeof listNotificationInputDtoSchema>;
export type ListNotificationOutputDtoType = z.infer<typeof listNotificationOutputDtoSchema>;
