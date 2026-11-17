import { z } from "zod";

export const userPreferenceAccentValues = [
  "#F97316",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#EAB308",
] as const;

export const userPreferenceAccentSchema = z.enum(userPreferenceAccentValues);
export type UserPreferenceAccent = z.infer<typeof userPreferenceAccentSchema>;