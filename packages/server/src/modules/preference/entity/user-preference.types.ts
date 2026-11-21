import type { UserPreferenceAccent } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import type { UserPreferenceDateFormat } from "@workspace/validation/modules/preference/consts/user-preference-date-format.const";
import type { UserPreferenceDensity } from "@workspace/validation/modules/preference/consts/user-preference-density.const";
import type { UserPreferenceLandingPage } from "@workspace/validation/modules/preference/consts/user-preference-landing-page.const";
import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";

export type UserPreferencePersistedType = {
  userId: string;
  timeZone: string;
  theme: UserPreferenceTheme;
  accent: UserPreferenceAccent;
  density: UserPreferenceDensity;
  dateFormat: UserPreferenceDateFormat;
  use24HourTime: boolean;
  reduceMotion: boolean | null;
  defaultLandingPage: UserPreferenceLandingPage;
  sidebarCollapsed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserPreferenceType = Partial<
  Pick<
    UserPreferencePersistedType,
    | "timeZone"
    | "theme"
    | "accent"
    | "density"
    | "dateFormat"
    | "use24HourTime"
    | "reduceMotion"
    | "defaultLandingPage"
    | "sidebarCollapsed"
  >
>;
