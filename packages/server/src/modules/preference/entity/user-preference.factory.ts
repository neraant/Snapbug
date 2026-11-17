import { UserPreference } from "@workspace/server/modules/preference/entity/user-preference.entity";
import { userPreferenceDefaults } from "@workspace/validation/modules/preference/dto/user-preference.model";

export abstract class UserPreferenceFactory {
  static create(userId: string): UserPreference {
    const now = new Date();
    return new UserPreference({
      userId,
      timeZone: userPreferenceDefaults.timeZone,
      theme: userPreferenceDefaults.theme,
      accent: userPreferenceDefaults.accent,
      density: userPreferenceDefaults.density,
      dateFormat: userPreferenceDefaults.dateFormat,
      use24HourTime: userPreferenceDefaults.use24HourTime,
      reduceMotion: userPreferenceDefaults.reduceMotion,
      defaultLandingPage: userPreferenceDefaults.defaultLandingPage,
      sidebarCollapsed: userPreferenceDefaults.sidebarCollapsed,
      createdAt: now,
      updatedAt: now,
    });
  }
}