import { useQuery } from "@tanstack/react-query";
import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { useDeferredValue, useMemo } from "react";

import { useActivityLogFilters } from "@/client/modules/activity-log/hooks/use-activity-log-filters";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindActivityLogs } from "@/client/modules/shared/queries/use-find-activity-logs";

export function useActivityLog() {
  const { filters, setFilters, clearFilters, hasActiveFilters, selectedEventId, setSelectedEventId } =
    useActivityLogFilters();
  const deferredSearch = useDeferredValue(filters.search.trim());

  const query = useFindActivityLogs({
    search: deferredSearch || undefined,
    actorId: filters.actorId,
    entityType: filters.entityType,
    range: filters.range,
  });

  const { data: teamMembers = [] } = useQuery(orpcQuery.membership.findTeamMembers.queryOptions());

  const entries = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data?.pages],
  );

  const selectedEntry = useMemo(() => {
    if (!selectedEventId) return null;
    return entries.find((entry) => entry.id === selectedEventId) ?? null;
  }, [entries, selectedEventId]);

  const actorOptions = useMemo(
    () =>
      teamMembers.map((member) => ({
        value: member.userId,
        label: member.name?.trim() ? `${member.name} (${member.email})` : member.email,
      })),
    [teamMembers],
  );

  return {
    entries,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    selectedEventId,
    setSelectedEventId,
    selectedEntry,
    actorOptions,
    query,
  };
}

export type ActivityLogEntry = ActivityLogType;