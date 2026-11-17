import { userPreferenceAccentSchema } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import { userPreferenceDateFormatSchema } from "@workspace/validation/modules/preference/consts/user-preference-date-format.const";
import { userPreferenceDensitySchema } from "@workspace/validation/modules/preference/consts/user-preference-density.const";
import { userPreferenceLandingPageSchema } from "@workspace/validation/modules/preference/consts/user-preference-landing-page.const";
import { userPreferenceThemeSchema } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { z } from "zod";

export const userPreferenceDefaults = {
  timeZone: "UTC",
  theme: "system",
  accent: "#F97316",
  density: "comfortable",
  dateFormat: "relative",
  use24HourTime: true,
  reduceMotion: null,
  defaultLandingPage: "overview",
  sidebarCollapsed: false,
} as const;

export const userPreferenceModelSchema = z.object({
  timeZone: z.string(),
  theme: userPreferenceThemeSchema,
  accent: userPreferenceAccentSchema,
  density: userPreferenceDensitySchema,
  dateFormat: userPreferenceDateFormatSchema,
  use24HourTime: z.boolean(),
  reduceMotion: z.boolean().nullable(),
  defaultLandingPage: userPreferenceLandingPageSchema,
  sidebarCollapsed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type UserPreferenceModelType = z.infer<typeof userPreferenceModelSchema>;