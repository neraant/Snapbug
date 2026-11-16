export type ProjectArchiveFilter = "active" | "archived" | "all";

export type ProjectFilters = {
  search: string;
  archiveStatus: ProjectArchiveFilter;
};
