import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/onboarding/consts/texts.const";
import {
  onboardingProjectSchema,
  type OnboardingProjectSchemaType,
} from "@/client/modules/onboarding/schemas/onboarding-project.schema";
import { useCreateProject } from "@/client/shared/queries/use-create-project";
import { useUpdateProject } from "@/client/shared/queries/use-update-project";

type UseOnboardingProjectStepInput = {
  initialName: string;
  organizationId: string;
  projectId: string | null;
  onSaved: VoidFunction;
};

export function useOnboardingProjectStep({
  initialName,
  organizationId,
  projectId,
  onSaved,
}: UseOnboardingProjectStepInput) {
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutateAsync: createProject, isPending: isCreating } = useCreateProject();
  const { control, handleSubmit, formState, getValues } = useForm<OnboardingProjectSchemaType>({
    resolver: zodResolver(onboardingProjectSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (projectId) {
        await updateProject({ projectId, name: values.name });
      } else {
        await createProject({ organizationId, name: values.name });
      }

      onSaved();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.project.toast.error),
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
