import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";

export const defaultProjectFilters: ProjectFilters = {
  search: "",
};

export const projectFiltersStorageKeyPrefix = "project-filters";
export const projectFiltersStorageEvent = "project-filters-change";
