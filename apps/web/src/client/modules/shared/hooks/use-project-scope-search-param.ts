"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import {
  formatProjectScopeSearchParam,
  parseProjectScopeSearchParam,
  resolveProjectScopeToken,
} from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { writeStoredProjectScope } from "@/client/modules/shared/utils/project-scope-storage.util";

export function useProjectScopeSearchParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: projects = [] } = useQuery(orpcQuery.project.findProjects.queryOptions());

  const scopeToken = parseProjectScopeSearchParam(searchParams.get(projectScopeSearchParamKey));
  const projectLookups = useMemo(() => projects.map((project) => ({ id: project.id, slug: project.slug })), [projects]);
  const projectId = useMemo(() => resolveProjectScopeToken(scopeToken, projectLookups), [scopeToken, projectLookups]);

  useEffect(() => {
    if (!searchParams.has(projectScopeSearchParamKey)) {
      return;
    }

    const token = parseProjectScopeSearchParam(searchParams.get(projectScopeSearchParamKey));
    const resolved = resolveProjectScopeToken(token, projectLookups);
    writeStoredProjectScope(resolved);
  }, [projectLookups, searchParams]);

  const setProjectId = useCallback(
    (nextProjectId: string | null) => {
      writeStoredProjectScope(nextProjectId);

      const params = new URLSearchParams(searchParams.toString());
      const serialized = formatProjectScopeSearchParam(nextProjectId, projectLookups);

      if (serialized == null) {
        params.delete(projectScopeSearchParamKey);
      } else {
        params.set(projectScopeSearchParamKey, serialized);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, projectLookups, router, searchParams],
  );

  return { projectId, setProjectId };
}
