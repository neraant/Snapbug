import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/project/consts/texts.const";
import {
  projectSettingsSchema,
  type ProjectSettingsSchemaType,
  projectSettingsUnassignedAssigneeValue,
} from "@/client/modules/project/schemas/project-settings.schema";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindProjectMembers } from "@/client/modules/shared/queries/use-find-project-members";
import { useUpdateProject } from "@/client/modules/shared/queries/use-update-project";

type UseProjectSettingsFormInput = {
  project: ProjectListItem;
  onSaved: VoidFunction;
};

export function useProjectSettingsForm({ project, onSaved }: UseProjectSettingsFormInput) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateProject, isPending } = useUpdateProject();
  const { data: members } = useFindProjectMembers(project.id);

  const defaultValues = useMemo<ProjectSettingsSchemaType>(
    () => ({
      name: project.name,
      slug: project.slug,
      color: project.color,
      defaultAssigneeId: project.defaultAssigneeId ?? projectSettingsUnassignedAssigneeValue,
      storeVisitorIp: project.storeVisitorIp,
      collectVisitorEmail: project.collectVisitorEmail,
    }),
    [project],
  );

  const { control, handleSubmit, reset, formState } = useForm<ProjectSettingsSchemaType>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const memberOptions = useMemo(
    () => [
      { value: projectSettingsUnassignedAssigneeValue, label: texts.settingsSheet.field.defaultAssignee.unassigned },
      ...members.map((member) => ({
        value: member.userId,
        label: member.name ?? member.email,
      })),
    ],
    [members],
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProject({
        projectId: project.id,
        name: values.name,
        slug: values.slug,
        color: values.color,
        defaultAssigneeId:
          values.defaultAssigneeId === projectSettingsUnassignedAssigneeValue ? null : values.defaultAssigneeId,
        storeVisitorIp: values.storeVisitorIp,
        collectVisitorEmail: values.collectVisitorEmail,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orpcQuery.project.findProjects.key() }),
        queryClient.invalidateQueries({ queryKey: orpcQuery.bugReport.countOpenByProject.key() }),
      ]);
      toast.add({ title: texts.settingsSheet.toast.saveSuccess, type: "success" });
      onSaved();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.settingsSheet.toast.saveError),
        type: "error",
      });
    }
  });

  const loading = formState.isSubmitting || isPending;

  return { control, onSubmit, loading, memberOptions };
}
