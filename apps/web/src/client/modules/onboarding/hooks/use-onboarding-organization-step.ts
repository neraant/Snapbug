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
import { useUpdateOrganization } from "@/client/modules/shared/queries/use-update-organization";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

type UseOnboardingOrganizationStepInput = {
  initialName: string;
  suggestedOrganizationName: string;
  workspace: OnboardingWorkspace | null;
  onSaved: (workspace: OnboardingWorkspace) => void;
};

export function useOnboardingOrganizationStep({
  initialName,
  suggestedOrganizationName,
  workspace,
  onSaved,
}: UseOnboardingOrganizationStepInput) {
  const { mutateAsync: createOrganization, isPending: isCreating } = useCreateOrganization();
  const { mutateAsync: updateOrganization, isPending: isUpdating } = useUpdateOrganization();
  const { control, handleSubmit, formState, getValues } = useForm<OnboardingOrganizationSchemaType>({
    resolver: zodResolver(onboardingOrganizationSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (workspace) {
        const organization = await updateOrganization({
          organizationId: workspace.organizationId,
          name: values.name,
        });

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

  return {
    control,
    onSubmit,
    skip: () => getValues("name"),
    loading: formState.isSubmitting || isCreating || isUpdating,
  };
}
