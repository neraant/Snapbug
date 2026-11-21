import type {
  UpdateUserNotificationPreferenceType,
  UserNotificationPreferencePersistedType,
} from "@workspace/server/modules/notification/entity/user-notification-preference.types";

export class UserNotificationPreference {
  readonly userId: UserNotificationPreferencePersistedType["userId"];
  readonly channels: UserNotificationPreferencePersistedType["channels"];
  readonly createdAt: UserNotificationPreferencePersistedType["createdAt"];
  readonly updatedAt: UserNotificationPreferencePersistedType["updatedAt"];

  constructor(userNotificationPreference: UserNotificationPreferencePersistedType) {
    this.userId = userNotificationPreference.userId;
    this.channels = userNotificationPreference.channels;
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
      channels: this.channels,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
