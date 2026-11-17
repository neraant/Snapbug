import { notificationObjectTypes } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import { notificationTypes } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";
import { organizationTable } from "@workspace/database/schema/organization.const";
import { projectTable } from "@workspace/database/schema/project.const";
import { userTable } from "@workspace/database/schema/user.const";
import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const notificationEmailPendingTable = pgTable(
  "notification_email_pending",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => userTable.id)
      .notNull(),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    type: text("type", { enum: notificationTypes }).notNull(),
    actorUserId: uuid("actor_user_id").references(() => userTable.id),
    objectType: text("object_type", { enum: notificationObjectTypes }).notNull(),
    objectId: uuid("object_id").notNull(),
    projectId: uuid("project_id").references(() => projectTable.id, { onDelete: "set null" }),
    payload: jsonb("payload").$type<NotificationPayloadType>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [index("notification_email_pending_user_id_idx").on(table.userId)],
);