import { useMemo } from "react";

import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";
import { filterProjectsByArchiveStatus } from "@/client/modules/project/utils/filter-projects-by-archive-status.util";
import { filterProjectsBySearch } from "@/client/modules/project/utils/filter-projects-by-search.util";
import { mergeProjectsWithOpenCount } from "@/client/modules/project/utils/merge-projects-with-open-count.util";
import { sortProjectsForList } from "@/client/modules/project/utils/sort-projects-for-list.util";
import { useCountOpenByProject } from "@/client/modules/shared/queries/use-count-open-by-project";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";

export function useProjectList(filters: ProjectFilters) {
  const { data: projects } = useFindProjects();
  const { data: openCounts } = useCountOpenByProject();

  const items = useMemo(() => mergeProjectsWithOpenCount(projects, openCounts), [openCounts, projects]);
  const filteredItems = useMemo(() => {
    const searched = filterProjectsBySearch(items, filters.search);
    const archived = filterProjectsByArchiveStatus(searched, filters.archiveStatus);
    return sortProjectsForList(archived);
  }, [filters.archiveStatus, filters.search, items]);

  return {
    items: filteredItems,
    isEmpty: projects.length === 0,
    isFilteredEmpty: projects.length > 0 && filteredItems.length === 0,
  };
}
