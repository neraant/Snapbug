import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { OnboardingStepActions } from "@/client/modules/onboarding/components/onboarding-step-actions";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import { useOnboardingOrganizationStep } from "@/client/modules/onboarding/hooks/use-onboarding-organization-step";
import type { OnboardingWorkspace } from "@/client/modules/onboarding/types/onboarding-workspace.type";

type OnboardingStepOrganizationFormProps = {
  initialName: string;
  suggestedOrganizationName: string;
  workspace: OnboardingWorkspace | null;
  onSaved: (workspace: OnboardingWorkspace) => void;
  onSkipOnboarding: (organizationName?: string) => void;
  skipLoading?: boolean;
};

export function OnboardingStepOrganizationForm({
  initialName,
  suggestedOrganizationName,
  workspace,
  onSaved,
  onSkipOnboarding,
  skipLoading = false,
}: OnboardingStepOrganizationFormProps) {
  const { control, onSubmit, onSkip, loading } = useOnboardingOrganizationStep({
    initialName,
    suggestedOrganizationName,
    workspace,
    onSaved,
    onSkipOnboarding,
  });
  const heading = workspace ? texts.organization.joined.title : texts.organization.title;
  const description = workspace ? texts.organization.joined.description : texts.organization.description;

  return (
    <Column as="form" width="full" gap="lg" onSubmit={onSubmit}>
      <Column width="full" gap="xs">
        <Typography variant="heading-md">{heading}</Typography>
        <Typography variant="text-sm" color="muted">
          {description}
        </Typography>
      </Column>
      <FieldGroup>
        <TextField
          control={control}
          name="name"
          type="text"
          label={texts.organization.field.label}
          placeholder={texts.organization.field.placeholder}
          autoComplete="organization"
        />
        {workspace ? null : (
          <Typography variant="text-xs" color="muted">
            {texts.organization.field.hint}
          </Typography>
        )}
        <OnboardingStepActions loading={loading || skipLoading} onSkip={onSkip} />
      </FieldGroup>
    </Column>
  );
}
