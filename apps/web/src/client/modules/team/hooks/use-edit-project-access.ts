import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { type FormEvent, useState } from "react";

import { useFindMembershipProjectAccess } from "@/client/modules/shared/queries/use-find-membership-project-access";
import { useFindTeamMembers } from "@/client/modules/shared/queries/use-find-team-members";
import { useReplaceMembershipProjectAccess } from "@/client/modules/shared/queries/use-replace-membership-project-access";
import { texts } from "@/client/modules/team/consts/texts.const";

export function useEditProjectAccess(membershipId: string, onClose: () => void) {
  const { data } = useFindMembershipProjectAccess(membershipId);
  const { data: members } = useFindTeamMembers();
  const { mutateAsync: replaceProjectAccess, isPending } = useReplaceMembershipProjectAccess();
  const member = members.find((item) => item.id === membershipId);
  const displayName = member?.name ?? member?.email ?? texts.column.member;
  const [selectedProjectIds, setSelectedProjectIds] = useState(() =>
    data.projects.filter((project) => project.allowed).map((project) => project.id),
  );

  const toggleProject = (projectId: string, allowed: boolean) => {
    setSelectedProjectIds((current) => {
      if (allowed) return current.includes(projectId) ? current : [...current, projectId];
      return current.filter((id) => id !== projectId);
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (data.locked || isPending) return;

    try {
      await replaceProjectAccess({ membershipId, projectIds: selectedProjectIds });
      onClose();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.projectAccess.saveError),
        type: "error",
      });
    }
  };

  return {
    projects: data.projects,
    locked: data.locked,
    displayName,
    selectedProjectIds,
    toggleProject,
    onSubmit,
    isPending,
  };
}
