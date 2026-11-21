import { z } from "zod";

export const userPreferenceLandingPageValues = ["overview", "tickets"] as const;
export const userPreferenceLandingPageSchema = z.enum(userPreferenceLandingPageValues);
export type UserPreferenceLandingPage = z.infer<typeof userPreferenceLandingPageSchema>;
