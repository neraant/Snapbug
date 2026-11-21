import { notificationObjectTypes } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import { notificationTypes } from "@workspace/validation/modules/notification/consts/notification-type.const";
import { organizationTable } from "@workspace/database/schema/organization.const";
import { projectTable } from "@workspace/database/schema/project.const";
import { userTable } from "@workspace/database/schema/user.const";
import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type NotificationPayloadType = {
  ticketShortId?: string;
  ticketTitle?: string;
  projectName?: string;
  projectSlug?: string;
  oldValue?: string;
  newValue?: string;
  count?: number;
  actorName?: string;
  memberName?: string;
  tokenName?: string;
  restored?: boolean;
};

export const notificationTable = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    recipientUserId: uuid("recipient_user_id")
      .references(() => userTable.id)
      .notNull(),
    type: text("type", { enum: notificationTypes }).notNull(),
    actorUserId: uuid("actor_user_id").references(() => userTable.id),
    objectType: text("object_type", { enum: notificationObjectTypes }).notNull(),
    objectId: uuid("object_id").notNull(),
    projectId: uuid("project_id").references(() => projectTable.id, { onDelete: "set null" }),
    payload: jsonb("payload").$type<NotificationPayloadType>().notNull(),
    readAt: timestamp("read_at", { withTimezone: true, mode: "date" }),
    archivedAt: timestamp("archived_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    index("notifications_recipient_read_created_idx").on(table.recipientUserId, table.readAt, table.createdAt),
    index("notifications_recipient_created_idx").on(table.recipientUserId, table.createdAt),
    index("notifications_org_recipient_idx").on(table.organizationId, table.recipientUserId),
  ],
);
