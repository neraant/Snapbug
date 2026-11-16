import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/design-system/components/ui/toast";
import { useCallback } from "react";

import { texts } from "@/client/modules/project/consts/texts.const";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useArchiveProject } from "@/client/modules/shared/queries/use-archive-project";
import { useDeleteProject } from "@/client/modules/shared/queries/use-delete-project";
import { useRestoreProject } from "@/client/modules/shared/queries/use-restore-project";

type UseProjectDangerActionsInput = {
  project: ProjectListItem;
  onProjectChanged: VoidFunction;
  onProjectDeleted: VoidFunction;
};

export function useProjectDangerActions({ project, onProjectChanged, onProjectDeleted }: UseProjectDangerActionsInput) {
  const queryClient = useQueryClient();
  const { mutateAsync: archiveProject, isPending: isArchiving } = useArchiveProject();
  const { mutateAsync: restoreProject, isPending: isRestoring } = useRestoreProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const invalidateProjectLists = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: orpcQuery.project.findProjects.key() }),
      queryClient.invalidateQueries({ queryKey: orpcQuery.bugReport.countOpenByProject.key() }),
    ]);
  }, [queryClient]);

  const onArchive = useCallback(async () => {
    await archiveProject({ projectId: project.id });
    await invalidateProjectLists();
    toast.add({ title: texts.settingsSheet.toast.archiveSuccess, type: "success" });
    onProjectChanged();
  }, [archiveProject, invalidateProjectLists, onProjectChanged, project.id]);

  const onRestore = useCallback(async () => {
    await restoreProject({ projectId: project.id });
    await invalidateProjectLists();
    toast.add({ title: texts.settingsSheet.toast.restoreSuccess, type: "success" });
    onProjectChanged();
  }, [invalidateProjectLists, onProjectChanged, project.id, restoreProject]);

  const onDelete = useCallback(async () => {
    await deleteProject({ projectId: project.id });
    await invalidateProjectLists();
    toast.add({ title: texts.settingsSheet.toast.deleteSuccess, type: "success" });
    onProjectDeleted();
  }, [deleteProject, invalidateProjectLists, onProjectDeleted, project.id]);

  return {
    onArchive,
    onRestore,
    onDelete,
    isArchiving,
    isRestoring,
    isDeleting,
    isArchived: project.archivedAt != null,
  };
}
