import type { ActivityLogDateRangeType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";
import type { ActivityLogEntityTypeFilterType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  activityLogSearchParamKey,
  defaultActivityLogFilters,
} from "@/client/modules/activity-log/consts/activity-log-filter.const";
import type { ActivityLogFilters } from "@/client/modules/activity-log/types/activity-log-filter.type";

const dateRanges = new Set<ActivityLogDateRangeType>(["24h", "7d", "30d", "all"]);
const entityTypes = new Set<ActivityLogEntityTypeFilterType>([
  "bug-report",
  "project",
  "membership",
  "invitation",
  "api-key",
  "organization",
]);

function readRange(value: string | null): ActivityLogDateRangeType {
  if (value && dateRanges.has(value as ActivityLogDateRangeType)) {
    return value as ActivityLogDateRangeType;
  }
  return defaultActivityLogFilters.range;
}

function readEntityType(value: string | null): ActivityLogEntityTypeFilterType | undefined {
  if (value && entityTypes.has(value as ActivityLogEntityTypeFilterType)) {
    return value as ActivityLogEntityTypeFilterType;
  }
  return undefined;
}

export function useActivityLogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ActivityLogFilters>(() => {
    return {
      search: searchParams.get(activityLogSearchParamKey.search) ?? "",
      actorId: searchParams.get(activityLogSearchParamKey.actor) ?? undefined,
      entityType: readEntityType(searchParams.get(activityLogSearchParamKey.type)),
      range: readRange(searchParams.get(activityLogSearchParamKey.range)),
    };
  }, [searchParams]);

  const selectedEventId = searchParams.get(activityLogSearchParamKey.event);

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setFilters = useCallback(
    (next: ActivityLogFilters) => {
      replaceParams((params) => {
        if (next.search.trim()) {
          params.set(activityLogSearchParamKey.search, next.search.trim());
        } else {
          params.delete(activityLogSearchParamKey.search);
        }

        if (next.actorId) {
          params.set(activityLogSearchParamKey.actor, next.actorId);
        } else {
          params.delete(activityLogSearchParamKey.actor);
        }

        if (next.entityType) {
          params.set(activityLogSearchParamKey.type, next.entityType);
        } else {
          params.delete(activityLogSearchParamKey.type);
        }

        if (next.range !== defaultActivityLogFilters.range) {
          params.set(activityLogSearchParamKey.range, next.range);
        } else {
          params.delete(activityLogSearchParamKey.range);
        }
      });
    },
    [replaceParams],
  );

  const clearFilters = useCallback(() => {
    replaceParams((params) => {
      params.delete(activityLogSearchParamKey.search);
      params.delete(activityLogSearchParamKey.actor);
      params.delete(activityLogSearchParamKey.type);
      params.delete(activityLogSearchParamKey.range);
    });
  }, [replaceParams]);

  const setSelectedEventId = useCallback(
    (eventId: string | null) => {
      replaceParams((params) => {
        if (eventId) {
          params.set(activityLogSearchParamKey.event, eventId);
        } else {
          params.delete(activityLogSearchParamKey.event);
        }
      });
    },
    [replaceParams],
  );

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    Boolean(filters.actorId) ||
    Boolean(filters.entityType) ||
    filters.range !== defaultActivityLogFilters.range;

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    selectedEventId,
    setSelectedEventId,
  };
}