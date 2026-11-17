import { z } from "zod";

export const userPreferenceDensityValues = ["comfortable", "compact"] as const;
export const userPreferenceDensitySchema = z.enum(userPreferenceDensityValues);
export type UserPreferenceDensity = z.infer<typeof userPreferenceDensitySchema>;