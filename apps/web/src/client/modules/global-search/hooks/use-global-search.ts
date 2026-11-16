import type { SearchOutputDtoType } from "@workspace/validation/modules/search/dto/search.schema";
import { useCallback, useEffect, useMemo, useState } from "react";

import { globalSearchResultsPerGroup } from "@/client/modules/global-search/consts/global-search.const";
import { useDebouncedValue } from "@/client/modules/global-search/hooks/use-debounced-value";
import {
  type GlobalSearchRecentItem,
  type GlobalSearchRecentProject,
  type GlobalSearchRecentTicket,
  pushGlobalSearchRecentItem,
  readGlobalSearchRecentItems,
} from "@/client/modules/global-search/utils/global-search-recent-storage.util";
import { useSearch } from "@/client/modules/shared/queries/use-search";

type UseGlobalSearchInput = {
  open: boolean;
};

type SearchProjectResult = SearchOutputDtoType["projects"][number];
type SearchTicketResult = SearchOutputDtoType["tickets"][number];

export type GlobalSearchSelectableItem =
  | { type: "ticket"; ticket: SearchTicketResult | GlobalSearchRecentTicket }
  | { type: "project"; project: SearchProjectResult | GlobalSearchRecentProject }
  | { type: "show-all-tickets" }
  | { type: "show-all-projects" };

export function useGlobalSearch({ open }: UseGlobalSearchInput) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery);
  const [recentItems, setRecentItems] = useState<GlobalSearchRecentItem[]>([]);
  const { data, isFetching, isLoading, isFetched } = useSearch({
    query: debouncedQuery,
    enabled: open && debouncedQuery.length > 0,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setRecentItems(readGlobalSearchRecentItems());
  }, [open]);

  const refreshRecent = useCallback(() => {
    setRecentItems(readGlobalSearchRecentItems());
  }, []);

  const recordTicketOpen = useCallback(
    (ticket: SearchTicketResult | GlobalSearchRecentTicket) => {
      pushGlobalSearchRecentItem({ kind: "ticket", ...ticket });
      refreshRecent();
    },
    [refreshRecent],
  );

  const recordProjectOpen = useCallback(
    (project: SearchProjectResult | GlobalSearchRecentProject) => {
      pushGlobalSearchRecentItem({ kind: "project", ...project });
      refreshRecent();
    },
    [refreshRecent],
  );

  const grouped = useMemo(() => {
    const tickets = data?.tickets ?? [];
    const projects = data?.projects ?? [];

    return {
      tickets,
      projects,
      visibleTickets: tickets.slice(0, globalSearchResultsPerGroup),
      visibleProjects: projects.slice(0, globalSearchResultsPerGroup),
      hasMoreTickets: tickets.length > globalSearchResultsPerGroup,
      hasMoreProjects: projects.length > globalSearchResultsPerGroup,
    };
  }, [data?.projects, data?.tickets]);

  const selectableItems = useMemo((): GlobalSearchSelectableItem[] => {
    if (trimmedQuery.length === 0) {
      return recentItems.map((item) =>
        item.kind === "ticket"
          ? ({ type: "ticket", ticket: item } as const)
          : ({ type: "project", project: item } as const),
      );
    }

    const items: GlobalSearchSelectableItem[] = [];

    for (const ticket of grouped.visibleTickets) {
      items.push({ type: "ticket", ticket });
    }
    if (grouped.hasMoreTickets) {
      items.push({ type: "show-all-tickets" });
    }

    for (const project of grouped.visibleProjects) {
      items.push({ type: "project", project });
    }
    if (grouped.hasMoreProjects) {
      items.push({ type: "show-all-projects" });
    }

    return items;
  }, [grouped, recentItems, trimmedQuery.length]);

  const showInitialSkeleton = trimmedQuery.length > 0 && isLoading && !isFetched && !data;
  const showEmptyResults =
    trimmedQuery.length > 0 &&
    !isFetching &&
    isFetched &&
    grouped.tickets.length === 0 &&
    grouped.projects.length === 0;

  return {
    query,
    setQuery,
    trimmedQuery,
    debouncedQuery,
    recentItems,
    grouped,
    selectableItems,
    showInitialSkeleton,
    showEmptyResults,
    isFetching,
    recordTicketOpen,
    recordProjectOpen,
  };
}