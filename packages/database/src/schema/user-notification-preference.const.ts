import { userTable } from "@workspace/database/schema/user.const";
import type { NotificationEmailDigest } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import { notificationEmailDigests } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { NotificationPreferenceChannelType } from "@workspace/validation/modules/notification/dto/notification-preference-channel.schema";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type UserNotificationPreferenceChannelsType = Partial<
  Record<NotificationPreferenceGroup, NotificationPreferenceChannelType>
>;

export const userNotificationPreferenceTable = pgTable("user_notification_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => userTable.id),
  emailDigest: text("email_digest", { enum: notificationEmailDigests })
    .$type<NotificationEmailDigest>()
    .notNull()
    .default("immediately"),
  channels: jsonb("channels").$type<UserNotificationPreferenceChannelsType>().notNull().default({}),
  emailDigestSentAt: timestamp("email_digest_sent_at", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
});