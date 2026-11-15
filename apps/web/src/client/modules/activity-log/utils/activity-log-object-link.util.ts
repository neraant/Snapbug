import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

import type { ProjectScopeLookup } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { url } from "@/shared/build-url.util";

export function resolveActivityObjectHref(
  entry: ActivityLogType,
  projects: ReadonlyArray<ProjectScopeLookup> = [],
): string | null {
  if (!entry.entityExists) return null;

  switch (entry.entityType) {
    case "organization":
      return url.settings();
    case "project":
      return buildPathWithProjectScopeSearchParam(url.ticketsBoard(), entry.entityId, projects);
    case "membership":
      return url.team();
    case "bug-report": {
      if (!entry.entityShortId) return null;
      return buildPathWithProjectScopeSearchParam(url.ticket(entry.entityShortId), entry.projectId, projects);
    }
    default:
      return null;
  }
}
