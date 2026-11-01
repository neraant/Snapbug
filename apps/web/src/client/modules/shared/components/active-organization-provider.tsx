import type { PropsWithChildren } from "react";

import { ActiveOrganizationContext } from "@/client/modules/shared/hooks/use-active-organization-id";

type ActiveOrganizationProviderProps = PropsWithChildren<{
  organizationId: string | null;
}>;

export function ActiveOrganizationProvider({ organizationId, children }: ActiveOrganizationProviderProps) {
  return <ActiveOrganizationContext.Provider value={organizationId}>{children}</ActiveOrganizationContext.Provider>;
}
