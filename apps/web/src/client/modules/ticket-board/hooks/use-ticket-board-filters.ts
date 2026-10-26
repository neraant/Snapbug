import { useCallback, useState, useSyncExternalStore } from "react";

import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { defaultTicketBoardFilters } from "@/client/modules/ticket-board/consts/ticket-board.const";
import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";
import {
  readStoredTicketBoardFilters,
  subscribeToTicketBoardFilters,
  writeStoredTicketBoardFilters,
} from "@/client/modules/ticket-board/utils/ticket-board-filters-storage.util";

export function useTicketBoardFilters() {
  const { data: membership } = useFindMembershipByUser();
  const organizationId = membership?.organizationId ?? null;
  const [localFilters, setLocalFilters] = useState<TicketBoardFilters>(defaultTicketBoardFilters);
  const storedFilters = useSyncExternalStore(
    subscribeToTicketBoardFilters,
    () => (organizationId ? readStoredTicketBoardFilters(organizationId) : defaultTicketBoardFilters),
    () => defaultTicketBoardFilters,
  );

  const setFilters = useCallback(
    (next: TicketBoardFilters) => {
      if (!organizationId) {
        setLocalFilters(next);
        return;
      }

      writeStoredTicketBoardFilters(organizationId, next);
    },
    [organizationId],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultTicketBoardFilters);
  }, [setFilters]);

  return {
    filters: organizationId ? storedFilters : localFilters,
    setFilters,
    clearFilters,
  };
}
