import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";

export type UserPreferencePersistedType = {
  userId: string;
  timeZone: string;
  theme: UserPreferenceTheme;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserPreferenceType = Partial<Pick<UserPreferencePersistedType, "timeZone" | "theme">>;