import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

import type { OnboardingWorkspace } from "@/client/modules/onboarding/types/onboarding-workspace.type";

export function toOnboardingWorkspace(snapshot: FindOnboardingOutputDtoType): OnboardingWorkspace | null {
  if (!snapshot.organizationId || !snapshot.organizationName) {
    return null;
  }

  return {
    ...snapshot,
    organizationId: snapshot.organizationId,
    organizationName: snapshot.organizationName,
  };
}
