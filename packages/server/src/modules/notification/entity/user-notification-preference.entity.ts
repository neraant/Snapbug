import type {
  UpdateUserNotificationPreferenceType,
  UserNotificationPreferencePersistedType,
} from "@workspace/server/modules/notification/entity/user-notification-preference.types";

export class UserNotificationPreference {
  readonly userId: UserNotificationPreferencePersistedType["userId"];
  readonly emailDigest: UserNotificationPreferencePersistedType["emailDigest"];
  readonly channels: UserNotificationPreferencePersistedType["channels"];
  readonly emailDigestSentAt: UserNotificationPreferencePersistedType["emailDigestSentAt"];
  readonly createdAt: UserNotificationPreferencePersistedType["createdAt"];
  readonly updatedAt: UserNotificationPreferencePersistedType["updatedAt"];

  constructor(userNotificationPreference: UserNotificationPreferencePersistedType) {
    this.userId = userNotificationPreference.userId;
    this.emailDigest = userNotificationPreference.emailDigest;
    this.channels = userNotificationPreference.channels;
    this.emailDigestSentAt = userNotificationPreference.emailDigestSentAt;
    this.createdAt = userNotificationPreference.createdAt;
    this.updatedAt = userNotificationPreference.updatedAt;
  }

  update(patch: UpdateUserNotificationPreferenceType): UserNotificationPreference {
    return new UserNotificationPreference({
      ...this.toObject(),
      ...patch,
      updatedAt: new Date(),
    });
  }

  toObject(): UserNotificationPreferencePersistedType {
    return {
      userId: this.userId,
      emailDigest: this.emailDigest,
      channels: this.channels,
      emailDigestSentAt: this.emailDigestSentAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}