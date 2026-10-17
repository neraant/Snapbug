import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { projectScopeStorageKey } from "@/client/modules/shared/consts/project-scope-search-param.const";

export function readStoredProjectScope(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(projectScopeStorageKey);
}

export function writeStoredProjectScope(projectId: string | null) {
  window.localStorage.setItem(projectScopeStorageKey, projectId == null ? overviewStatAllProjectsValue : projectId);
}

export function isStoredProjectScopeValid(storedValue: string, projectIds: ReadonlySet<string>) {
  if (storedValue === overviewStatAllProjectsValue) {
    return true;
  }

  return projectIds.has(storedValue);
}
