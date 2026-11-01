"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Button } from "@workspace/design-system/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";

import { ProjectCreateSheet } from "@/client/modules/project/components/project-create-sheet";
import { ProjectFiltersBar } from "@/client/modules/project/components/project-filters";
import { ProjectList } from "@/client/modules/project/components/project-list";
import { texts } from "@/client/modules/project/consts/texts.const";
import { useProjectFilters } from "@/client/modules/project/hooks/use-project-filters";

export default function Page() {
  const { filters, setFilters } = useProjectFilters();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <PageContainer
      title={texts.title}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          {texts.newProject}
        </Button>
      }
    >
      <Column gap="lg" width="full" minWidth="0">
        <ProjectFiltersBar filters={filters} onFiltersChange={setFilters} />
        <Suspense fallback={<ProjectList.Fallback />}>
          <ProjectList search={filters.search} />
        </Suspense>
      </Column>
      {createOpen ? (
        <Suspense fallback={null}>
          <ProjectCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
        </Suspense>
      ) : null}
    </PageContainer>
  );
}
