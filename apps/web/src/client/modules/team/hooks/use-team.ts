import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { useMemo, useState } from "react";

import { useCountOpenByAssignee } from "@/client/modules/shared/queries/use-count-open-by-assignee";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { useFindTeamMembers } from "@/client/modules/shared/queries/use-find-team-members";
import { useRemoveMembership } from "@/client/modules/shared/queries/use-remove-membership";
import { useUpdateMembershipRole } from "@/client/modules/shared/queries/use-update-membership-role";
import { texts } from "@/client/modules/team/consts/texts.const";
import { useTeamFilters } from "@/client/modules/team/hooks/use-team-filters";
import { filterTeamMembers, toOpenCountByUserId } from "@/client/modules/team/utils/team-member.util";

export function useTeam() {
  const { filters, setFilters } = useTeamFilters();
  const { data: members } = useFindTeamMembers();
  const { data: counts } = useCountOpenByAssignee();
  const { data: currentMembership } = useFindMembershipByUser();
  const { mutateAsync: updateMembershipRole, isPending: isUpdatingRole } = useUpdateMembershipRole();
  const { mutateAsync: removeMembership, isPending: isRemoving } = useRemoveMembership();
  const [projectAccessMembershipId, setProjectAccessMembershipId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => filterTeamMembers(members, filters.search), [filters.search, members]);
  const openCountByUserId = useMemo(() => toOpenCountByUserId(counts), [counts]);

  const updateRole = (membershipId: string, role: UserRole) => {
    updateMembershipRole({ membershipId, role }).catch((error: unknown) => {
      toast.add({
        title: getAppErrorMessage(error, texts.role.updateError),
        type: "error",
      });
    });
  };

  const remove = (membershipId: string) => {
    removeMembership({ membershipId }).catch((error: unknown) => {
      toast.add({
        title: getAppErrorMessage(error, texts.action.removeError),
        type: "error",
      });
    });
  };

  return {
    filteredMembers,
    openCountByUserId,
    currentUserId: currentMembership?.userId,
    filters,
    setFilters,
    updateRole,
    remove,
    isMutating: isUpdatingRole || isRemoving,
    projectAccessMembershipId,
    openProjectAccess: setProjectAccessMembershipId,
    closeProjectAccess: () => setProjectAccessMembershipId(null),
  };
}
