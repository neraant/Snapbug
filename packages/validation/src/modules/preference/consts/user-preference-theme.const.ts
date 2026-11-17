import { z } from "zod";

export const userPreferenceThemeValues = ["light", "dark", "system"] as const;
export const userPreferenceThemeSchema = z.enum(userPreferenceThemeValues);
export type UserPreferenceTheme = z.infer<typeof userPreferenceThemeSchema>;