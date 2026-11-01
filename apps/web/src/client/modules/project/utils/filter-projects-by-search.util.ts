import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";

export function filterProjectsBySearch(projects: ProjectListItem[], search: string): ProjectListItem[] {
  const query = search.trim().toLowerCase();
  if (!query) {
    return projects;
  }

  return projects.filter((project) => project.name.toLowerCase().includes(query));
}
