import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";

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
