import { UserPreference } from "@workspace/server/modules/preference/entity/user-preference.entity";
import type { UserPreferencePersistedType } from "@workspace/server/modules/preference/entity/user-preference.types";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";

export abstract class UserPreferenceMapper {
  static fromPersistence(row: UserPreferencePersistedType): UserPreference {
    return new UserPreference(row);
  }

  static toPersistence(userPreference: UserPreference): UserPreferencePersistedType {
    return userPreference.toObject();
  }

  static toDto(userPreference: UserPreference): UserPreferenceModelType {
    const values = userPreference.toObject();
    return {
      timeZone: values.timeZone,
      theme: values.theme,
      accent: values.accent,
      density: values.density,
      dateFormat: values.dateFormat,
      use24HourTime: values.use24HourTime,
      reduceMotion: values.reduceMotion,
      defaultLandingPage: values.defaultLandingPage,
      sidebarCollapsed: values.sidebarCollapsed,
      createdAt: values.createdAt.toISOString(),
      updatedAt: values.updatedAt.toISOString(),
    };
  }
}
