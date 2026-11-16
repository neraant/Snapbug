import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Row } from "@workspace/design-system/components/layout/row";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { ProjectCard } from "@/client/modules/project/components/project-card";
import { ProjectListEmpty } from "@/client/modules/project/components/project-list-empty";
import { useProjectList } from "@/client/modules/project/hooks/use-project-list";
import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";

type ProjectListProps = {
  filters: ProjectFilters;
};

export function ProjectList({ filters }: ProjectListProps) {
  const { items, isEmpty, isFilteredEmpty } = useProjectList(filters);

  if (isEmpty) {
    return <ProjectListEmpty variant="none" />;
  }

  if (isFilteredEmpty) {
    return <ProjectListEmpty variant="filtered" />;
  }

  return (
    <Grid columns="responsive-projects" gap="lg">
      {items.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Grid>
  );
}

function ProjectListFallback() {
  return (
    <Grid columns="responsive-projects" gap="lg">
      {Array.from({ length: 6 }, (_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </Grid>
  );
}

function ProjectCardSkeleton() {
  return (
    <Column gap="none" width="full" className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <Column gap="md" padding="md" width="full">
        <Row align="center" justify="between" width="full">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-8 rounded-md" />
        </Row>
        <Column gap="xs" width="full">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </Column>
        <Row align="center" gap="md" width="full">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </Row>
        <Row align="center" justify="between" width="full">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-3 w-20" />
        </Row>
      </Column>
    </Column>
  );
}

ProjectList.Fallback = ProjectListFallback;
