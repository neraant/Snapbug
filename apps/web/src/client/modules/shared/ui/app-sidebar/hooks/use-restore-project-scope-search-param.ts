"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import {
  parseProjectScopeSearchParam,
  resolveProjectScopeToken,
} from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import {
  isStoredProjectScopeValid,
  readStoredProjectScope,
} from "@/client/modules/shared/utils/project-scope-storage.util";

export function useRestoreProjectScopeSearchParam() {
  const searchParams = useSearchParams();
  const { setProjectId } = useProjectScopeSearchParam();
  const { data: projects = [] } = useQuery(orpcQuery.project.findProjects.queryOptions());
  const restoredRef = useRef(false);

  const projectLookups = useMemo(() => projects.map((project) => ({ id: project.id, slug: project.slug })), [projects]);
  const projectIds = useMemo(() => new Set(projects.map((project) => project.id)), [projects]);

  useEffect(() => {
    const token = parseProjectScopeSearchParam(searchParams.get(projectScopeSearchParamKey));
    if (!token) return;

    const resolvedProjectId = resolveProjectScopeToken(token, projectLookups);
    if (resolvedProjectId == null || !projectIds.has(resolvedProjectId)) {
      setProjectId(null);
    }
  }, [projectIds, projectLookups, searchParams, setProjectId]);

  useEffect(() => {
    if (restoredRef.current) {
      return;
    }

    if (searchParams.has(projectScopeSearchParamKey)) {
      restoredRef.current = true;
      return;
    }

    const storedValue = readStoredProjectScope();
    if (storedValue == null) {
      restoredRef.current = true;
      return;
    }

    if (!isStoredProjectScopeValid(storedValue, projectIds)) {
      restoredRef.current = true;
      return;
    }

    restoredRef.current = true;

    if (storedValue === overviewStatAllProjectsValue) {
      return;
    }

    setProjectId(storedValue);
  }, [projectIds, searchParams, setProjectId]);
}
