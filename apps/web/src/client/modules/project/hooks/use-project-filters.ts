import { useCallback, useState, useSyncExternalStore } from "react";

import { defaultProjectFilters } from "@/client/modules/project/consts/project-filter.const";
import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";
import {
  readStoredProjectFilters,
  subscribeToProjectFilters,
  writeStoredProjectFilters,
} from "@/client/modules/project/utils/project-filters-storage.util";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";

export function useProjectFilters() {
  const { data: membership } = useFindMembershipByUser();
  const organizationId = membership?.organizationId ?? null;
  const [localFilters, setLocalFilters] = useState<ProjectFilters>(defaultProjectFilters);
  const storedFilters = useSyncExternalStore(
    subscribeToProjectFilters,
    () => (organizationId ? readStoredProjectFilters(organizationId) : defaultProjectFilters),
    () => defaultProjectFilters,
  );

  const setFilters = useCallback(
    (next: ProjectFilters) => {
      if (!organizationId) {
        setLocalFilters(next);
        return;
      }

      writeStoredProjectFilters(organizationId, next);
    },
    [organizationId],
  );

  return {
    filters: organizationId ? storedFilters : localFilters,
    setFilters,
  };
}
