export const settingsTabSearchParamKey = "tab";

export const settingsTabs = {
  profile: "profile",
  organization: "organization",
  tokens: "tokens",
} as const;

export type SettingsTab = (typeof settingsTabs)[keyof typeof settingsTabs];

export const defaultSettingsTab = settingsTabs.profile;