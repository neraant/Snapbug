import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

export function resolveInitialOnboardingStep(snapshot: FindOnboardingOutputDtoType): number {
  return snapshot.organizationId ? 2 : 1;
}
