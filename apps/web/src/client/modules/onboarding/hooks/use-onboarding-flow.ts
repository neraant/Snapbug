import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { CompleteOnboardingInputDtoType } from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import { useCallback, useState } from "react";

import { texts } from "@/client/modules/onboarding/consts/texts.const";
import type { OnboardingWorkspace } from "@/client/modules/onboarding/types/onboarding-workspace.type";
import { resolveInitialOnboardingStep } from "@/client/modules/onboarding/utils/resolve-initial-onboarding-step.util";
import { toOnboardingWorkspace } from "@/client/modules/onboarding/utils/to-onboarding-workspace.util";
import { useCompleteOnboarding } from "@/client/shared/queries/use-complete-onboarding";
import { useFindOnboarding } from "@/client/shared/queries/use-find-onboarding";

export function useOnboardingFlow() {
  const { data: snapshot } = useFindOnboarding();
  const { mutateAsync: completeOnboarding, isPending: isCompleting } = useCompleteOnboarding();
  const [createdWorkspace, setCreatedWorkspace] = useState<OnboardingWorkspace | null>(null);
  const [step, setStep] = useState(() => resolveInitialOnboardingStep(snapshot));

  const workspace = createdWorkspace ?? toOnboardingWorkspace(snapshot);

  const leaveOnboarding = useCallback(
    async (input: CompleteOnboardingInputDtoType = {}) => {
      try {
        await completeOnboarding(input);
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.toast.completeError),
          type: "error",
        });
      }
    },
    [completeOnboarding],
  );

  const onOrganizationSaved = useCallback((saved: OnboardingWorkspace) => {
    setCreatedWorkspace(saved);
    setStep(2);
  }, []);

  return {
    snapshot,
    step,
    setStep,
    workspace,
    isCompleting,
    leaveOnboarding,
    onOrganizationSaved,
  };
}
