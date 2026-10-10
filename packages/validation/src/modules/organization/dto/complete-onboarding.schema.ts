import { findOnboardingOutputDtoSchema } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { z } from "zod";

export const completeOnboardingInputDtoSchema = z.object({
  organizationName: z.string().trim().optional(),
  projectName: z.string().trim().optional(),
});

export type CompleteOnboardingInputDtoType = z.infer<typeof completeOnboardingInputDtoSchema>;

export const completeOnboardingOutputDtoSchema = findOnboardingOutputDtoSchema;

export type CompleteOnboardingOutputDtoType = z.infer<typeof completeOnboardingOutputDtoSchema>;
