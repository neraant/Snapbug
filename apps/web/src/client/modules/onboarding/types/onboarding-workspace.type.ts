import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

export type OnboardingWorkspace = FindOnboardingOutputDtoType & {
  organizationId: string;
  organizationName: string;
};
