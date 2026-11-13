import { z } from "zod";

export const organizationSettingsSchema = z.object({
  name: z.string().trim().min(1),
  reportsRetentionDays: z
    .string()
    .trim()
    .regex(/^[1-9]\d*$/, "Enter a whole number of days"),
});

export type OrganizationSettingsSchemaType = z.infer<typeof organizationSettingsSchema>;
