import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { toast } from "@workspace/design-system/components/ui/toast";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { OnboardingInstallSnippet } from "@/client/modules/onboarding/components/onboarding-install-snippet";
import { OnboardingStepActions } from "@/client/modules/onboarding/components/onboarding-step-actions";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import {
  onboardingProjectSchema,
  type OnboardingProjectSchemaType,
} from "@/client/modules/onboarding/schemas/onboarding-project.schema";
import { useCreateProject } from "@/client/shared/queries/use-create-project";
import { useUpdateProject } from "@/client/shared/queries/use-update-project";

type OnboardingStepProjectFormProps = {
  organizationId: string;
  projectId: string | null;
  defaultName: string;
  onContinue: VoidFunction;
  onSkip: VoidFunction;
};

export function OnboardingStepProjectForm({
  organizationId,
  projectId,
  defaultName,
  onContinue,
  onSkip,
}: OnboardingStepProjectFormProps) {
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: createProject } = useCreateProject();
  const [isSkipping, setIsSkipping] = useState(false);
  const { control, handleSubmit, formState, getValues } = useForm<OnboardingProjectSchemaType>({
    resolver: zodResolver(onboardingProjectSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const saveProject = async (name: string) => {
    if (projectId) {
      await updateProject({
        projectId,
        name,
      });
      return;
    }

    await createProject({
      organizationId,
      name,
    });
  };

  const onSubmit = async (values: OnboardingProjectSchemaType) => {
    try {
      await saveProject(values.name);
      onContinue();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.project.toast.error),
        type: "error",
      });
    }
  };

  const skip = async () => {
    setIsSkipping(true);
    try {
      if (!projectId) {
        await createProject({
          organizationId,
          name: getValues("name") || defaultName,
        });
      }
      onSkip();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.project.toast.error),
        type: "error",
      });
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <Column as="form" width="full" gap="lg" onSubmit={handleSubmit(onSubmit)}>
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
        <OnboardingInstallSnippet />
        <OnboardingStepActions loading={formState.isSubmitting || isSkipping} onSkip={skip} />
      </FieldGroup>
    </Column>
  );
}
