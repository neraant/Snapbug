import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";
import { writeStoredProjectScope } from "@/client/modules/shared/utils/project-scope-storage.util";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

type SelectOrganizationOptions = {
  refresh?: boolean;
};

export function useSelectActiveOrganization() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectOrganization = useCallback(
    async (organizationId: string, options?: SelectOrganizationOptions) => {
      await selectActiveOrganization(organizationId);
      writeStoredProjectScope(null);

      if (options?.refresh === false) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.delete(projectScopeSearchParamKey);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      await queryClient.invalidateQueries();
      router.refresh();
    },
    [pathname, queryClient, router, searchParams],
  );

  return { selectOrganization };
}
