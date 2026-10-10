import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { OnboardingStepActions } from "@/client/modules/onboarding/components/onboarding-step-actions";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import { useOnboardingProjectStep } from "@/client/modules/onboarding/hooks/use-onboarding-project-step";

type OnboardingStepProjectFormProps = {
  organizationId: string;
  projectId: string | null;
  initialName: string;
  onBack: VoidFunction;
  onSaved: VoidFunction;
  onSkipOnboarding: (projectName: string) => void;
  skipLoading?: boolean;
};

export function OnboardingStepProjectForm({
  organizationId,
  projectId,
  initialName,
  onBack,
  onSaved,
  onSkipOnboarding,
  skipLoading = false,
}: OnboardingStepProjectFormProps) {
  const { control, onSubmit, skip, loading } = useOnboardingProjectStep({
    initialName,
    organizationId,
    projectId,
    onSaved,
  });

  return (
    <Column as="form" width="full" gap="lg" onSubmit={onSubmit}>
      <Column width="full" gap="xs">
        <Typography variant="heading-md">{texts.project.title}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.project.description}
        </Typography>
      </Column>
      <FieldGroup>
        <TextField
          control={control}
          name="name"
          type="text"
          label={texts.project.field.name.label}
          placeholder={texts.project.field.name.placeholder}
        />
        <Typography variant="text-xs" color="muted">
          {texts.project.field.name.hint}
        </Typography>
        <OnboardingStepActions
          onBack={onBack}
          loading={loading || skipLoading}
          onSkip={() => onSkipOnboarding(skip())}
        />
      </FieldGroup>
    </Column>
  );
}
