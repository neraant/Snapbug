export const settingsTabSearchParamKey = "tab";

export const settingsTabs = {
  profile: "profile",
  preferences: "preferences",
  notifications: "notifications",
  organization: "organization",
} as const;

export type SettingsTab = (typeof settingsTabs)[keyof typeof settingsTabs];

export const defaultSettingsTab = settingsTabs.profile;