"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Suspense, useEffect, useState } from "react";

import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { TicketBoard } from "@/client/modules/ticket-board/components/ticket-board";
import { TicketBoardBody } from "@/client/modules/ticket-board/components/ticket-board-body";
import { TicketBoardFiltersBar } from "@/client/modules/ticket-board/components/ticket-board-filters";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { useTicketBoardFilters } from "@/client/modules/ticket-board/hooks/use-ticket-board-filters";

export default function Page() {
  const { projectId } = useProjectScopeSearchParam();
  const { filters, setFilters, clearFilters } = useTicketBoardFilters();
  const [filteredCount, setFilteredCount] = useState<number | null>(null);

  useEffect(() => {
    setFilteredCount(null);
  }, [projectId, filters]);

  return (
    <PageContainer
      title={texts.title}
      description={texts.description}
      badge={filteredCount === null ? null : <Badge variant="secondary">{filteredCount}</Badge>}
    >
      <Column gap="lg" minWidth="0" width="full" className="h-full">
        <TicketBoardFiltersBar filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
        <Suspense fallback={<TicketBoard.Fallback />}>
          <TicketBoardBody
            projectId={projectId}
            filters={filters}
            onClearFilters={clearFilters}
            onFilteredCountChange={setFilteredCount}
          />
        </Suspense>
      </Column>
    </PageContainer>
  );
}
