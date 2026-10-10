import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

export function hasCompletedOnboarding(snapshot: FindOnboardingOutputDtoType): boolean {
  return snapshot.completedAt != null;
}
