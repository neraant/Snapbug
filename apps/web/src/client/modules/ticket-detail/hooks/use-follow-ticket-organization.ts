import { useEffect, useRef } from "react";

import { useActiveOrganizationId } from "@/client/modules/shared/hooks/use-active-organization-id";
import { useSelectActiveOrganization } from "@/client/modules/shared/hooks/use-select-active-organization";
import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";

export function useFollowTicketOrganization(shortId: string) {
  const { data: ticket } = useFindBugReport({ shortId });
  const activeOrganizationId = useActiveOrganizationId();
  const { selectOrganization } = useSelectActiveOrganization();
  const requestedOrganizationId = useRef<string | null>(null);

  useEffect(() => {
    if (ticket.organizationId === activeOrganizationId) return;
    if (requestedOrganizationId.current === ticket.organizationId) return;

    requestedOrganizationId.current = ticket.organizationId;
    selectOrganization(ticket.organizationId).catch(() => {
      requestedOrganizationId.current = null;
    });
  }, [activeOrganizationId, selectOrganization, ticket.organizationId]);

  return { showActiveOrganizationData: ticket.organizationId === activeOrganizationId };
}
