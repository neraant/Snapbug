import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";

export function parseProjectScopeSearchParam(value: string | null | undefined): string | null {
  if (value == null || value === "" || value === overviewStatAllProjectsValue) {
    return null;
  }

  return value;
}

export function formatProjectScopeSearchParam(projectId: string | null): string | null {
  if (projectId == null) {
    return null;
  }

  return projectId;
}

export function buildPathWithProjectScopeSearchParam(pathname: string, projectId: string | null): string {
  const serialized = formatProjectScopeSearchParam(projectId);
  if (serialized == null) {
    return pathname;
  }

  const params = new URLSearchParams();
  params.set(projectScopeSearchParamKey, serialized);
  return `${pathname}?${params.toString()}`;
}
