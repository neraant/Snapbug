import { z } from "zod";

import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { projectScopeSearchParamKey } from "@/client/modules/shared/consts/project-scope-search-param.const";

const projectScopeUuidSchema = z.uuid();

export type ProjectScopeLookup = {
  id: string;
  slug: string;
};

export function parseProjectScopeSearchParam(value: string | null | undefined): string | null {
  if (value == null || value === "" || value === overviewStatAllProjectsValue) {
    return null;
  }

  return value;
}

export function isProjectScopeLegacyIdToken(token: string): boolean {
  return projectScopeUuidSchema.safeParse(token).success;
}

export function resolveProjectScopeToken(
  token: string | null,
  projects: ReadonlyArray<ProjectScopeLookup>,
): string | null {
  if (token == null) {
    return null;
  }

  if (isProjectScopeLegacyIdToken(token)) {
    const project = projects.find((item) => item.id === token);
    return project?.id ?? null;
  }

  const project = projects.find((item) => item.slug === token);
  return project?.id ?? null;
}

export function formatProjectScopeSearchParam(
  projectId: string | null,
  projects: ReadonlyArray<ProjectScopeLookup>,
): string | null {
  if (projectId == null) {
    return null;
  }

  const project = projects.find((item) => item.id === projectId);
  return project?.slug ?? (isProjectScopeLegacyIdToken(projectId) ? projectId : null);
}

export function buildPathWithProjectScopeSearchParam(
  pathname: string,
  projectId: string | null,
  projects: ReadonlyArray<ProjectScopeLookup> = [],
): string {
  const serialized = formatProjectScopeSearchParam(projectId, projects);
  if (serialized == null) {
    return pathname;
  }

  const params = new URLSearchParams();
  params.set(projectScopeSearchParamKey, serialized);
  return `${pathname}?${params.toString()}`;
}
