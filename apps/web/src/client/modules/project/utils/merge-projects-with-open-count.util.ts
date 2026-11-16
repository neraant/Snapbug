import type { CountOpenByProjectOutputDtoType } from "@workspace/validation/modules/bug-report/dto/count-open-by-project.schema";
import type { FindProjectsOutputDtoType } from "@workspace/validation/modules/project/dto/find-projects.schema";

import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";

export function mergeProjectsWithOpenCount(
  projects: FindProjectsOutputDtoType,
  openCounts: CountOpenByProjectOutputDtoType,
): ProjectListItem[] {
  const ticketStatsByProjectId = new Map(openCounts.map((row) => [row.projectId, row]));

  return projects.map((project) => {
    const stats = ticketStatsByProjectId.get(project.id);

    return {
      ...project,
      openCount: stats?.openCount ?? 0,
      totalCount: stats?.totalCount ?? 0,
      lastTicketAt: stats?.lastTicketAt ?? null,
    };
  });
}
