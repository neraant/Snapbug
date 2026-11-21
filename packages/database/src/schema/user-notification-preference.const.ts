import { userTable } from "@workspace/database/schema/user.const";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { NotificationPreferenceChannelType } from "@workspace/validation/modules/notification/dto/notification-preference-channel.schema";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export type UserNotificationPreferenceChannelsType = Partial<
  Record<NotificationPreferenceGroup, NotificationPreferenceChannelType>
>;

export const userNotificationPreferenceTable = pgTable("user_notification_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => userTable.id),
  channels: jsonb("channels").$type<UserNotificationPreferenceChannelsType>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
});
