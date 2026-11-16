import type { ProjectArchiveFilter, ProjectFilters } from "@/client/modules/project/types/project-filter.type";

export const projectArchiveFilterValues = ["active", "archived", "all"] as const satisfies readonly ProjectArchiveFilter[];

export const defaultProjectFilters: ProjectFilters = {
  search: "",
  archiveStatus: "active",
};

export const projectFiltersStorageKeyPrefix = "project-filters";
export const projectFiltersStorageEvent = "project-filters-change";
