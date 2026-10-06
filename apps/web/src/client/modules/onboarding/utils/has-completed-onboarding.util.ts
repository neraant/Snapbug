import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

export function hasCompletedOnboarding(snapshot: NonNullable<FindOnboardingOutputDtoType>): boolean {
  return snapshot.organizationName.trim().length > 0 && snapshot.projectId !== null;
}
