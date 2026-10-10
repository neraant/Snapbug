import { Column } from "@workspace/design-system/components/layout/column";

import { OnboardingStepOrganizationForm } from "@/client/modules/onboarding/components/onboarding-step-organization-form";
import { OnboardingStepProgress } from "@/client/modules/onboarding/components/onboarding-step-progress";
import { OnboardingStepProjectForm } from "@/client/modules/onboarding/components/onboarding-step-project-form";
import { OnboardingStepTeammateForm } from "@/client/modules/onboarding/components/onboarding-step-teammate-form";
import { ONBOARDING_TOTAL_STEP } from "@/client/modules/onboarding/consts/onboarding.const";
import { onboardingStepLabel } from "@/client/modules/onboarding/consts/onboarding-step.const";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import { useOnboardingFlow } from "@/client/modules/onboarding/hooks/use-onboarding-flow";

export function OnboardingSteps() {
  const { snapshot, step, setStep, workspace, isCompleting, leaveOnboarding, onOrganizationSaved } =
    useOnboardingFlow();

  const organizationInitialName = workspace?.organizationName ?? snapshot.suggestedOrganizationName;

  return (
    <Column width="full" gap="lg" className="py-8">
      <OnboardingStepProgress
        currentStep={step}
        totalSteps={ONBOARDING_TOTAL_STEP}
        stepLabel={onboardingStepLabel(step)}
      />
      {step === 1 ? (
        <OnboardingStepOrganizationForm
          initialName={organizationInitialName}
          suggestedOrganizationName={snapshot.suggestedOrganizationName}
          workspace={workspace}
          onSaved={onOrganizationSaved}
          onSkipOnboarding={(organizationName) => void leaveOnboarding({ organizationName })}
          skipLoading={isCompleting}
        />
      ) : null}
      {step === 2 && workspace ? (
        <OnboardingStepProjectForm
          organizationId={workspace.organizationId}
          projectId={workspace.projectId}
          initialName={workspace.projectName ?? texts.project.field.name.placeholder}
          onBack={() => setStep(1)}
          onSaved={() => setStep(3)}
          onSkipOnboarding={(projectName) => void leaveOnboarding({ projectName })}
          skipLoading={isCompleting}
        />
      ) : null}
      {step === 3 && workspace ? (
        <OnboardingStepTeammateForm
          organizationId={workspace.organizationId}
          onBack={() => setStep(2)}
          onSkip={() => void leaveOnboarding()}
        />
      ) : null}
    </Column>
  );
}
