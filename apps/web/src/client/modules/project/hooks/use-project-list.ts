import { useMemo } from "react";

import { filterProjectsBySearch } from "@/client/modules/project/utils/filter-projects-by-search.util";
import { mergeProjectsWithOpenCount } from "@/client/modules/project/utils/merge-projects-with-open-count.util";
import { useCountOpenByProject } from "@/client/modules/shared/queries/use-count-open-by-project";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";

export function useProjectList(search: string) {
  const { data: projects } = useFindProjects();
  const { data: openCounts } = useCountOpenByProject();

  const items = useMemo(() => mergeProjectsWithOpenCount(projects, openCounts), [openCounts, projects]);
  const filteredItems = useMemo(() => filterProjectsBySearch(items, search), [items, search]);

  return {
    items: filteredItems,
    isEmpty: projects.length === 0,
    isFilteredEmpty: projects.length > 0 && filteredItems.length === 0,
  };
}
