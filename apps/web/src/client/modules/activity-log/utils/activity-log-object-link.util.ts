import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

import { url } from "@/shared/build-url.util";

export function resolveActivityObjectHref(entry: ActivityLogType): string | null {
  switch (entry.entityType) {
    case "organization":
      return url.settings();
    case "project":
      return url.projects();
    case "membership":
    case "invitation":
      return url.team();
    case "bug-report":
      return url.ticketsBoard();
    default:
      return null;
  }
}