"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { parseProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import {
  isStoredProjectScopeValid,
  readStoredProjectScope,
} from "@/client/modules/shared/utils/project-scope-storage.util";

export function useRestoreProjectScopeSearchParam() {
  const searchParams = useSearchParams();
  const { setProjectId } = useProjectScopeSearchParam();
  const { data: projects } = useFindProjects();
  const restoredRef = useRef(false);

  useEffect(() => {
    const currentProjectId = parseProjectScopeSearchParam(searchParams.get(projectScopeSearchParamKey));
    if (!currentProjectId) return;

    const projectIds = new Set(projects.map((project) => project.id));
    if (!projectIds.has(currentProjectId)) {
      setProjectId(null);
    }
  }, [projects, searchParams, setProjectId]);

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

    const projectIds = new Set(projects.map((project) => project.id));
    if (!isStoredProjectScopeValid(storedValue, projectIds)) {
      restoredRef.current = true;
      return;
    }

    restoredRef.current = true;

    if (storedValue === overviewStatAllProjectsValue) {
      return;
    }

    setProjectId(storedValue);
  }, [projects, searchParams, setProjectId]);
}
