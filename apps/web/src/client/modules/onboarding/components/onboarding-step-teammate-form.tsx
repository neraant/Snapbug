import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { PlusIcon, RocketIcon, SparklesIcon, XIcon } from "lucide-react";

import { OnboardingStepActions } from "@/client/modules/onboarding/components/onboarding-step-actions";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import { useOnboardingTeammateStep } from "@/client/modules/onboarding/hooks/use-onboarding-teammate-step";

type OnboardingStepTeammateFormProps = {
  organizationId: string;
  onBack: VoidFunction;
  onSkip: VoidFunction;
};

export function OnboardingStepTeammateForm({ organizationId, onBack, onSkip }: OnboardingStepTeammateFormProps) {
  const { control, fields, append, remove, loading, onFinish } = useOnboardingTeammateStep({
    organizationId,
  });

  return (
    <Column as="form" width="full" gap="lg" onSubmit={onFinish}>
      <Column width="full" gap="xs">
        <Typography variant="heading-md">{texts.teammate.title}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.teammate.description}
        </Typography>
      </Column>
      <FieldGroup>
        <Column width="full" gap="md">
          {fields.map((field, index) => (
            <Row key={field.id} align="center" gap="sm" width="full">
              <Column width="full" className="min-w-0 flex-1">
                <TextField
                  control={control}
                  name={`invites.${index}.email`}
                  type="email"
                  label={texts.teammate.field.label}
                  placeholder={texts.teammate.field.placeholder}
                  autoComplete="email"
                />
              </Column>
              {fields.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-7 shrink-0"
                  aria-label={texts.teammate.removeInvite}
                  onClick={() => remove(index)}
                  disabled={loading}
                >
                  <XIcon />
                </Button>
              ) : null}
            </Row>
          ))}
          <Button
            type="button"
            variant="link"
            className="h-auto w-fit px-0"
            onClick={() => append({ email: "" })}
            disabled={loading}
          >
            <PlusIcon />
            {texts.teammate.addAnother}
          </Button>
        </Column>
        <Card width="full" padding="none" className="bg-muted/50">
          <Card.Header>
            <Card.Icon>
              <RocketIcon className="text-primary" />
            </Card.Icon>
            <Card.Title variant="text-sm" weight="bold">
              {texts.teammate.ready.title}
            </Card.Title>
            <Card.Description variant="text-xs">{texts.teammate.ready.description}</Card.Description>
          </Card.Header>
        </Card>
        <OnboardingStepActions
          onBack={onBack}
          continueLabel={texts.teammate.finish}
          continueIcon={<SparklesIcon />}
          onPrimaryClick={onFinish}
          onSkip={onSkip}
          skipLabel={texts.teammate.skip}
          loading={loading}
        />
      </FieldGroup>
    </Column>
  );
}
