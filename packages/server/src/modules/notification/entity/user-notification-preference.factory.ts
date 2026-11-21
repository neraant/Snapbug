import { UserNotificationPreference } from "@workspace/server/modules/notification/entity/user-notification-preference.entity";
import { notificationPreferenceDefaults } from "@workspace/validation/modules/notification/dto/notification-preference.model";

export abstract class UserNotificationPreferenceFactory {
  static create(userId: string): UserNotificationPreference {
    const now = new Date();
    return new UserNotificationPreference({
      userId,
      emailDigest: notificationPreferenceDefaults.emailDigest,
      channels: {},
      emailDigestSentAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }
}
