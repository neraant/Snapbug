import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { NotificationPreferenceChannelType } from "@workspace/validation/modules/notification/dto/notification-preference-channel.schema";

export type UserNotificationPreferenceChannelsType = Partial<
  Record<NotificationPreferenceGroup, NotificationPreferenceChannelType>
>;

export type UserNotificationPreferencePersistedType = {
  userId: string;
  channels: UserNotificationPreferenceChannelsType;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserNotificationPreferenceType = Partial<Pick<UserNotificationPreferencePersistedType, "channels">>;