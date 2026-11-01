import { createContext, useContext } from "react";

const ActiveOrganizationContext = createContext<string | null>(null);

export function useActiveOrganizationId() {
  return useContext(ActiveOrganizationContext);
}

export { ActiveOrganizationContext };
