import { userPreferenceThemeSchema } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { z } from "zod";

export const userPreferenceDefaults = {
  timeZone: "UTC",
  theme: "system",
} as const;

export const userPreferenceModelSchema = z.object({
  timeZone: z.string(),
  theme: userPreferenceThemeSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type UserPreferenceModelType = z.infer<typeof userPreferenceModelSchema>;