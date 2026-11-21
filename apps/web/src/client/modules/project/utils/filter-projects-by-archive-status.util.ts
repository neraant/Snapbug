import type { ProjectArchiveFilter } from "@/client/modules/project/types/project-filter.type";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";

export function filterProjectsByArchiveStatus(
  projects: ProjectListItem[],
  archiveStatus: ProjectArchiveFilter,
): ProjectListItem[] {
  if (archiveStatus === "all") {
    return projects;
  }

  if (archiveStatus === "active") {
    return projects.filter((project) => project.archivedAt == null);
  }

  return projects.filter((project) => project.archivedAt != null);
}
