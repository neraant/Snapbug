import { z } from "zod";

export const onboardingProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
});

export type OnboardingProjectSchemaType = z.infer<typeof onboardingProjectSchema>;
