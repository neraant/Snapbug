import type {
  UpdateUserPreferenceType,
  UserPreferencePersistedType,
} from "@workspace/server/modules/preference/entity/user-preference.types";

export class UserPreference {
  readonly userId: UserPreferencePersistedType["userId"];
  readonly timeZone: UserPreferencePersistedType["timeZone"];
  readonly theme: UserPreferencePersistedType["theme"];
  readonly createdAt: UserPreferencePersistedType["createdAt"];
  readonly updatedAt: UserPreferencePersistedType["updatedAt"];

  constructor(userPreference: UserPreferencePersistedType) {
    this.userId = userPreference.userId;
    this.timeZone = userPreference.timeZone;
    this.theme = userPreference.theme;
    this.createdAt = userPreference.createdAt;
    this.updatedAt = userPreference.updatedAt;
  }

  update(patch: UpdateUserPreferenceType): UserPreference {
    return new UserPreference({
      ...this.toObject(),
      ...patch,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  toObject(): UserPreferencePersistedType {
    return {
      userId: this.userId,
      timeZone: this.timeZone,
      theme: this.theme,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
