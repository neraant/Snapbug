import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";

export function sortProjectsForList(projects: ProjectListItem[]): ProjectListItem[] {
  const active: ProjectListItem[] = [];
  const archived: ProjectListItem[] = [];

  for (const project of projects) {
    if (project.archivedAt != null) {
      archived.push(project);
      continue;
    }

    active.push(project);
  }

  return [...active, ...archived];
}