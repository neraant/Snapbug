import type { CountOpenByProjectOutputDtoType } from "@workspace/validation/modules/bug-report/dto/count-open-by-project.schema";
import type { FindProjectsOutputDtoType } from "@workspace/validation/modules/project/dto/find-projects.schema";

import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";

export function mergeProjectsWithOpenCount(
  projects: FindProjectsOutputDtoType,
  openCounts: CountOpenByProjectOutputDtoType,
): ProjectListItem[] {
  const openCountByProjectId = new Map(openCounts.map((row) => [row.projectId, row.openCount]));

  return projects.map((project) => ({
    ...project,
    openCount: openCountByProjectId.get(project.id) ?? 0,
  }));
}
