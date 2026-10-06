import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { toast } from "@workspace/design-system/components/ui/toast";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { OnboardingStepActions } from "@/client/modules/onboarding/components/onboarding-step-actions";
import { texts } from "@/client/modules/onboarding/consts/texts.const";
import {
  onboardingOrganizationSchema,
  type OnboardingOrganizationSchemaType,
} from "@/client/modules/onboarding/schemas/onboarding-organization.schema";
import { useCreateOrganization } from "@/client/shared/queries/use-create-organization";

type OnboardingSnapshot = NonNullable<FindOnboardingOutputDtoType>;

type OnboardingStepOrganizationFormProps = {
  defaultName: string;
  onCreated: (snapshot: OnboardingSnapshot) => void;
};

export function OnboardingStepOrganizationForm({ defaultName, onCreated }: OnboardingStepOrganizationFormProps) {
  const { mutateAsync: createOrganization, isPending } = useCreateOrganization();
  const { control, handleSubmit, formState, getValues, reset } = useForm<OnboardingOrganizationSchemaType>({
    resolver: zodResolver(onboardingOrganizationSchema),
    defaultValues: { name: defaultName },
  });

  useEffect(() => {
    const currentName = getValues("name");
    if (currentName === "Workspace" || currentName === "") {
      reset({ name: defaultName });
    }
  }, [defaultName, getValues, reset]);

  const createWorkspace = async (name: string) => {
    const result = await createOrganization({ name });
    return {
      organizationId: result.organization.id,
      organizationName: result.organization.name,
      projectId: result.project.id,
      projectName: result.project.name,
    } satisfies OnboardingSnapshot;
  };

  const onSubmit = async (values: OnboardingOrganizationSchemaType) => {
    try {
      onCreated(await createWorkspace(values.name));
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.organization.toast.error),
        type: "error",
      });
    }
  };

  const skip = async () => {
    try {
      onCreated(await createWorkspace(getValues("name") || defaultName));
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.organization.toast.error),
        type: "error",
      });
    }
  };

  return (
    <Column as="form" width="full" gap="lg" onSubmit={handleSubmit(onSubmit)}>
      <Column width="full" gap="xs">
        <Typography variant="heading-md">{texts.organization.title}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.organization.description}
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
        <Typography variant="text-xs" color="muted">
          {texts.organization.field.hint}
        </Typography>
        <OnboardingStepActions loading={formState.isSubmitting || isPending} onSkip={skip} />
      </FieldGroup>
    </Column>
  );
}
