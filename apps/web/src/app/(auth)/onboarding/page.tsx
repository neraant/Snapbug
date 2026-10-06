"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { OnboardingStepOrganizationForm } from "@/client/modules/onboarding/components/onboarding-step-organization-form";
import { OnboardingStepProgress } from "@/client/modules/onboarding/components/onboarding-step-progress";
import { OnboardingStepProjectForm } from "@/client/modules/onboarding/components/onboarding-step-project-form";
import { OnboardingStepTeammateForm } from "@/client/modules/onboarding/components/onboarding-step-teammate-form";
import { ONBOARDING_TOTAL_STEP } from "@/client/modules/onboarding/consts/onboarding.const";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import { defaultOrganizationName } from "@/client/modules/onboarding/utils/default-organization-name.util";
import { useFindOnboarding } from "@/client/shared/queries/use-find-onboarding";
import { path } from "@/shared/path.const";

type OnboardingSnapshot = NonNullable<FindOnboardingOutputDtoType>;

function resolveInitialStep(snapshot: FindOnboardingOutputDtoType): number {
  if (!snapshot?.organizationName.trim()) {
    return 1;
  }
  return 2;
}

const stepLabelByNumber: Record<number, string> = {
  1: texts.step.organization,
  2: texts.step.project,
  3: texts.step.teammate,
};

export default function Page() {
  const router = useRouter();
  const { data: snapshot, isSuccess } = useFindOnboarding();
  const [createdWorkspace, setCreatedWorkspace] = useState<OnboardingSnapshot | null>(null);
  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const [organizationNameDefault, setOrganizationNameDefault] = useState("Workspace");

  useEffect(() => {
    void getSession().then((session) => {
      setOrganizationNameDefault(defaultOrganizationName(session?.user));
    });
  }, []);

  const workspace = createdWorkspace ?? snapshot ?? null;
  const step = stepOverride ?? (isSuccess ? resolveInitialStep(snapshot ?? null) : null);

  const stepLabel = useMemo(
    () => (step === null ? texts.step.organization : (stepLabelByNumber[step] ?? texts.step.organization)),
    [step],
  );
  const leave = () => {
    router.replace(path.home);
  };

  if (step === null) {
    return null;
  }

  return (
    <Column width="full" gap="lg" className="py-8">
      <OnboardingStepProgress currentStep={step} totalSteps={ONBOARDING_TOTAL_STEP} stepLabel={stepLabel} />
      {step === 1 ? (
        <OnboardingStepOrganizationForm
          defaultName={organizationNameDefault}
          onCreated={(created) => {
            setCreatedWorkspace(created);
            setStepOverride(2);
          }}
        />
      ) : null}
      {step === 2 && workspace ? (
        <OnboardingStepProjectForm
          organizationId={workspace.organizationId}
          projectId={workspace.projectId}
          defaultName={workspace.projectName ?? texts.project.field.name.placeholder}
          onContinue={() => setStepOverride(3)}
          onSkip={leave}
        />
      ) : null}
      {step === 3 ? <OnboardingStepTeammateForm onBack={() => setStepOverride(2)} /> : null}
    </Column>
  );
}
