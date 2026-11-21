import type {
  UpdateUserPreferenceType,
  UserPreferencePersistedType,
} from "@workspace/server/modules/preference/entity/user-preference.types";

export class UserPreference {
  readonly userId: UserPreferencePersistedType["userId"];
  readonly timeZone: UserPreferencePersistedType["timeZone"];
  readonly theme: UserPreferencePersistedType["theme"];
  readonly accent: UserPreferencePersistedType["accent"];
  readonly density: UserPreferencePersistedType["density"];
  readonly dateFormat: UserPreferencePersistedType["dateFormat"];
  readonly use24HourTime: UserPreferencePersistedType["use24HourTime"];
  readonly reduceMotion: UserPreferencePersistedType["reduceMotion"];
  readonly defaultLandingPage: UserPreferencePersistedType["defaultLandingPage"];
  readonly sidebarCollapsed: UserPreferencePersistedType["sidebarCollapsed"];
  readonly createdAt: UserPreferencePersistedType["createdAt"];
  readonly updatedAt: UserPreferencePersistedType["updatedAt"];

  constructor(userPreference: UserPreferencePersistedType) {
    this.userId = userPreference.userId;
    this.timeZone = userPreference.timeZone;
    this.theme = userPreference.theme;
    this.accent = userPreference.accent;
    this.density = userPreference.density;
    this.dateFormat = userPreference.dateFormat;
    this.use24HourTime = userPreference.use24HourTime;
    this.reduceMotion = userPreference.reduceMotion;
    this.defaultLandingPage = userPreference.defaultLandingPage;
    this.sidebarCollapsed = userPreference.sidebarCollapsed;
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
      accent: this.accent,
      density: this.density,
      dateFormat: this.dateFormat,
      use24HourTime: this.use24HourTime,
      reduceMotion: this.reduceMotion,
      defaultLandingPage: this.defaultLandingPage,
      sidebarCollapsed: this.sidebarCollapsed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
