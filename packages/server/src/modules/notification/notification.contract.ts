import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  archiveNotificationInputDtoSchema,
  archiveNotificationOutputDtoSchema,
} from "@workspace/validation/modules/notification/dto/archive-notification.schema";
import {
  listNotificationInputDtoSchema,
  listNotificationOutputDtoSchema,
} from "@workspace/validation/modules/notification/dto/list-notification.schema";
import { markAllReadOutputDtoSchema } from "@workspace/validation/modules/notification/dto/mark-all-read.schema";
import {
  markReadInputDtoSchema,
  markReadOutputDtoSchema,
} from "@workspace/validation/modules/notification/dto/mark-read.schema";
import {
  markUnreadInputDtoSchema,
  markUnreadOutputDtoSchema,
} from "@workspace/validation/modules/notification/dto/mark-unread.schema";
import { findNotificationPreferenceOutputDtoSchema } from "@workspace/validation/modules/notification/dto/find-notification-preference.schema";
import {
  updateNotificationPreferenceInputDtoSchema,
  updateNotificationPreferenceOutputDtoSchema,
} from "@workspace/validation/modules/notification/dto/update-notification-preference.schema";
import { unreadCountOutputDtoSchema } from "@workspace/validation/modules/notification/dto/unread-count.schema";

export const notificationContract = {
  list: oc
    .input(listNotificationInputDtoSchema.partial().optional())
    .output(listNotificationOutputDtoSchema)
    .route({
      method: "GET",
      path: "/notifications",
      tags: ["notification"],
      summary: "List notifications for the current user",
      spec: sessionAuthSpec,
    }),
  unreadCount: oc.output(unreadCountOutputDtoSchema).route({
    method: "GET",
    path: "/notifications/unread-count",
    tags: ["notification"],
    summary: "Unread notification count",
    spec: sessionAuthSpec,
  }),
  markRead: oc
    .input(markReadInputDtoSchema)
    .output(markReadOutputDtoSchema)
    .route({
      method: "POST",
      path: "/notifications/mark-read",
      tags: ["notification"],
      summary: "Mark notifications as read",
      spec: sessionAuthSpec,
    }),
  markUnread: oc
    .input(markUnreadInputDtoSchema)
    .output(markUnreadOutputDtoSchema)
    .route({
      method: "POST",
      path: "/notifications/mark-unread",
      tags: ["notification"],
      summary: "Mark notifications as unread",
      spec: sessionAuthSpec,
    }),
  markAllRead: oc.output(markAllReadOutputDtoSchema).route({
    method: "POST",
    path: "/notifications/mark-all-read",
    tags: ["notification"],
    summary: "Mark all notifications as read",
    spec: sessionAuthSpec,
  }),
  archive: oc
    .input(archiveNotificationInputDtoSchema)
    .output(archiveNotificationOutputDtoSchema)
    .route({
      method: "POST",
      path: "/notifications/archive",
      tags: ["notification"],
      summary: "Archive notifications",
      spec: sessionAuthSpec,
    }),
  findPreference: oc.output(findNotificationPreferenceOutputDtoSchema).route({
    method: "GET",
    path: "/notifications/preferences",
    tags: ["notification"],
    summary: "Find notification delivery preferences",
    spec: sessionAuthSpec,
  }),
  updatePreference: oc
    .input(updateNotificationPreferenceInputDtoSchema)
    .output(updateNotificationPreferenceOutputDtoSchema)
    .route({
      method: "PATCH",
      path: "/notifications/preferences",
      tags: ["notification"],
      summary: "Update notification delivery preferences",
      spec: sessionAuthSpec,
    }),
};
