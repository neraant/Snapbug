import { z } from "zod";

export const userPreferenceDateFormatValues = ["relative", "absolute"] as const;
export const userPreferenceDateFormatSchema = z.enum(userPreferenceDateFormatValues);
export type UserPreferenceDateFormat = z.infer<typeof userPreferenceDateFormatSchema>;
