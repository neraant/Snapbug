import { z } from "zod";

export const onboardingOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required"),
});

export type OnboardingOrganizationSchemaType = z.infer<typeof onboardingOrganizationSchema>;
