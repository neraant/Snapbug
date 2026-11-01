import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { projectColorDefault } from "@workspace/validation/shared/project-color.schema";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/project/consts/texts.const";
import {
  projectCreateSchema,
  type ProjectCreateSchemaType,
} from "@/client/modules/project/schemas/project-create.schema";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useCreateProject } from "@/client/modules/shared/queries/use-create-project";
import { useFindOnboarding } from "@/client/modules/shared/queries/use-find-onboarding";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";

type UseCreateProjectFormInput = {
  onCreated: VoidFunction;
};

export function useCreateProjectForm({ onCreated }: UseCreateProjectFormInput) {
  const queryClient = useQueryClient();
  const { data: onboarding } = useFindOnboarding();
  const { data: projects } = useFindProjects();
  const { mutateAsync: createProject, isPending } = useCreateProject();

  const { control, handleSubmit, reset, formState } = useForm<ProjectCreateSchemaType>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: { name: "", color: projectColorDefault },
  });

  const resolveOrganizationId = useCallback(() => {
    return onboarding.organizationId ?? projects[0]?.organizationId ?? null;
  }, [onboarding.organizationId, projects]);

  const onSubmit = handleSubmit(async (values) => {
    const organizationId = resolveOrganizationId();
    if (!organizationId) {
      toast.add({
        title: texts.toast.missingOrganization,
        type: "error",
      });
      return;
    }

    try {
      await createProject({ organizationId, name: values.name, color: values.color });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orpcQuery.project.findProjects.key() }),
        queryClient.invalidateQueries({ queryKey: orpcQuery.bugReport.countOpenByProject.key() }),
      ]);
      reset({ name: "", color: projectColorDefault });
      onCreated();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.toast.createError),
        type: "error",
      });
    }
  });

  return {
    control,
    onSubmit,
    loading: formState.isSubmitting || isPending,
  };
}
