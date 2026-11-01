import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { ProjectCard } from "@/client/modules/project/components/project-card";
import { ProjectListEmpty } from "@/client/modules/project/components/project-list-empty";
import { useProjectList } from "@/client/modules/project/hooks/use-project-list";

type ProjectListProps = {
  search: string;
};

export function ProjectList({ search }: ProjectListProps) {
  const { items, isEmpty, isFilteredEmpty } = useProjectList(search);

  if (isEmpty) {
    return <ProjectListEmpty variant="none" />;
  }

  if (isFilteredEmpty) {
    return <ProjectListEmpty variant="filtered" />;
  }

  return (
    <Grid columns="responsive-3" gap="lg">
      {items.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Grid>
  );
}

function ProjectListFallback() {
  return (
    <Grid columns="responsive-3" gap="lg">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </Grid>
  );
}

ProjectList.Fallback = ProjectListFallback;
