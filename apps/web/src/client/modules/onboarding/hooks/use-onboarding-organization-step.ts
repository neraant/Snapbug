import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/onboarding/consts/texts.const";
import {
  onboardingOrganizationSchema,
  type OnboardingOrganizationSchemaType,
} from "@/client/modules/onboarding/schemas/onboarding-organization.schema";
import type { OnboardingWorkspace } from "@/client/modules/onboarding/types/onboarding-workspace.type";
import { useCreateOrganization } from "@/client/modules/shared/queries/use-create-organization";
import { useUpdateOnboardingOrganization } from "@/client/modules/shared/queries/use-update-onboarding-organization";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

type UseOnboardingOrganizationStepInput = {
  initialName: string;
  suggestedOrganizationName: string;
  workspace: OnboardingWorkspace | null;
  onSaved: (workspace: OnboardingWorkspace) => void;
  onSkipOnboarding: (organizationName?: string) => void;
};

export function useOnboardingOrganizationStep({
  initialName,
  suggestedOrganizationName,
  workspace,
  onSaved,
  onSkipOnboarding,
}: UseOnboardingOrganizationStepInput) {
  const { mutateAsync: createOrganization, isPending: isCreating } = useCreateOrganization();
  const { mutateAsync: updateOnboardingOrganization, isPending: isUpdating } = useUpdateOnboardingOrganization();
  const { control, handleSubmit, formState, getValues } = useForm<OnboardingOrganizationSchemaType>({
    resolver: zodResolver(onboardingOrganizationSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (workspace) {
        const organization = await updateOnboardingOrganization({
          organizationId: workspace.organizationId,
          name: values.name,
        });
        await selectActiveOrganization(workspace.organizationId);

        onSaved({
          ...workspace,
          organizationName: organization.name,
        });
        return;
      }

      const result = await createOrganization({ name: values.name });
      await selectActiveOrganization(result.organization.id);
      onSaved({
        completedAt: null,
        suggestedOrganizationName,
        organizationId: result.organization.id,
        organizationName: result.organization.name,
        projectId: result.project.id,
        projectName: result.project.name,
      });
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.organization.toast.error),
        type: "error",
      });
    }
  });

  const onSkip = () => {
    const name = getValues("name").trim();
    const run = async () => {
      if (workspace) {
        if (name) {
          await updateOnboardingOrganization({ organizationId: workspace.organizationId, name });
        }
        await selectActiveOrganization(workspace.organizationId);
        onSkipOnboarding();
        return;
      }

      onSkipOnboarding(name);
    };

    run().catch((error: unknown) => {
      toast.add({
        title: getAppErrorMessage(error, texts.organization.toast.error),
        type: "error",
      });
    });
  };

  return {
    control,
    onSubmit,
    onSkip,
    loading: formState.isSubmitting || isCreating || isUpdating,
  };
}
