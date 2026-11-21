import { z } from "zod";
import { notificationObjectTypes } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import { notificationTypes } from "@workspace/validation/modules/notification/consts/notification-type.const";
import { notificationPayloadSchema } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export const notificationModelSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  recipientUserId: z.uuid(),
  type: z.enum(notificationTypes),
  actorUserId: z.uuid().nullable(),
  objectType: z.enum(notificationObjectTypes),
  objectId: z.uuid(),
  projectId: z.uuid().nullable(),
  payload: notificationPayloadSchema,
  readAt: z.iso.datetime().nullable(),
  archivedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  accessible: z.boolean(),
});

export type NotificationModelType = z.infer<typeof notificationModelSchema>;
