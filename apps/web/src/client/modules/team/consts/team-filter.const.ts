import type { TeamFilters } from "@/client/modules/team/types/team-filter.type";

export const defaultTeamFilters: TeamFilters = {
  search: "",
};

export const teamFiltersStorageKeyPrefix = "team-filters";
export const teamFiltersStorageEvent = "team-filters-change";
