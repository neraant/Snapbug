import type { NotificationEmailDigest } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { NotificationPreferenceChannelType } from "@workspace/validation/modules/notification/dto/notification-preference-channel.schema";

export type UserNotificationPreferenceChannelsType = Partial<
  Record<NotificationPreferenceGroup, NotificationPreferenceChannelType>
>;

export type UserNotificationPreferencePersistedType = {
  userId: string;
  emailDigest: NotificationEmailDigest;
  channels: UserNotificationPreferenceChannelsType;
  emailDigestSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserNotificationPreferenceType = Partial<
  Pick<UserNotificationPreferencePersistedType, "emailDigest" | "channels" | "emailDigestSentAt">
>;
