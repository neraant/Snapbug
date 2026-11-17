import { userPreferenceAccentSchema } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import { userPreferenceDateFormatSchema } from "@workspace/validation/modules/preference/consts/user-preference-date-format.const";
import { userPreferenceDensitySchema } from "@workspace/validation/modules/preference/consts/user-preference-density.const";
import { userPreferenceLandingPageSchema } from "@workspace/validation/modules/preference/consts/user-preference-landing-page.const";
import { userPreferenceThemeSchema } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { userPreferenceModelSchema } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { z } from "zod";

export const updateUserPreferenceInputDtoSchema = z
  .object({
    timeZone: z.string().min(1).optional(),
    theme: userPreferenceThemeSchema.optional(),
    accent: userPreferenceAccentSchema.optional(),
    density: userPreferenceDensitySchema.optional(),
    dateFormat: userPreferenceDateFormatSchema.optional(),
    use24HourTime: z.boolean().optional(),
    reduceMotion: z.boolean().nullable().optional(),
    defaultLandingPage: userPreferenceLandingPageSchema.optional(),
    sidebarCollapsed: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.timeZone !== undefined ||
      value.theme !== undefined ||
      value.accent !== undefined ||
      value.density !== undefined ||
      value.dateFormat !== undefined ||
      value.use24HourTime !== undefined ||
      value.reduceMotion !== undefined ||
      value.defaultLandingPage !== undefined ||
      value.sidebarCollapsed !== undefined,
    { message: "At least one field must be provided" },
  );

export type UpdateUserPreferenceInputDtoType = z.infer<typeof updateUserPreferenceInputDtoSchema>;

export const updateUserPreferenceOutputDtoSchema = userPreferenceModelSchema;

export type UpdateUserPreferenceOutputDtoType = z.infer<typeof updateUserPreferenceOutputDtoSchema>;