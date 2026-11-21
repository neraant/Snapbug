import { UserNotificationPreference } from "@workspace/server/modules/notification/entity/user-notification-preference.entity";

export abstract class UserNotificationPreferenceFactory {
  static create(userId: string): UserNotificationPreference {
    const now = new Date();
    return new UserNotificationPreference({
      userId,
      channels: {},
      createdAt: now,
      updatedAt: now,
    });
  }
}