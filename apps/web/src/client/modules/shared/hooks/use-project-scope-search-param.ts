"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";
import {
  formatProjectScopeSearchParam,
  parseProjectScopeSearchParam,
} from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { writeStoredProjectScope } from "@/client/modules/shared/utils/project-scope-storage.util";

export function useProjectScopeSearchParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projectId = parseProjectScopeSearchParam(searchParams.get(projectScopeSearchParamKey));

  useEffect(() => {
    if (!searchParams.has(projectScopeSearchParamKey)) {
      return;
    }

    const parsed = parseProjectScopeSearchParam(searchParams.get(projectScopeSearchParamKey));
    writeStoredProjectScope(parsed);
  }, [searchParams]);

  const setProjectId = useCallback(
    (nextProjectId: string | null) => {
      writeStoredProjectScope(nextProjectId);

      const params = new URLSearchParams(searchParams.toString());
      const serialized = formatProjectScopeSearchParam(nextProjectId);

      if (serialized == null) {
        params.delete(projectScopeSearchParamKey);
      } else {
        params.set(projectScopeSearchParamKey, serialized);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { projectId, setProjectId };
}
