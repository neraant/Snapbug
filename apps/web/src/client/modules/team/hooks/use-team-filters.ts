import { useCallback, useState, useSyncExternalStore } from "react";

import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { defaultTeamFilters } from "@/client/modules/team/consts/team-filter.const";
import type { TeamFilters } from "@/client/modules/team/types/team-filter.type";
import {
  readStoredTeamFilters,
  subscribeToTeamFilters,
  writeStoredTeamFilters,
} from "@/client/modules/team/utils/team-filters-storage.util";

export function useTeamFilters() {
  const { data: membership } = useFindMembershipByUser();
  const organizationId = membership?.organizationId ?? null;
  const [localFilters, setLocalFilters] = useState<TeamFilters>(defaultTeamFilters);
  const storedFilters = useSyncExternalStore(
    subscribeToTeamFilters,
    () => (organizationId ? readStoredTeamFilters(organizationId) : defaultTeamFilters),
    () => defaultTeamFilters,
  );

  const setFilters = useCallback(
    (next: TeamFilters) => {
      if (!organizationId) {
        setLocalFilters(next);
        return;
      }

      writeStoredTeamFilters(organizationId, next);
    },
    [organizationId],
  );

  return {
    filters: organizationId ? storedFilters : localFilters,
    setFilters,
  };
}
