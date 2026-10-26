"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { TicketBoard } from "@/client/modules/ticket-board/components/ticket-board";
import { TicketBoardBody } from "@/client/modules/ticket-board/components/ticket-board-body";
import { TicketBoardFiltersBar } from "@/client/modules/ticket-board/components/ticket-board-filters";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { useTicketBoardFilters } from "@/client/modules/ticket-board/hooks/use-ticket-board-filters";

export default function Page() {
  const { projectId } = useProjectScopeSearchParam();
  const { filters, setFilters, clearFilters } = useTicketBoardFilters();

  return (
    <PageContainer title={texts.title} description={texts.description}>
      <Column gap="lg" minWidth="0" width="full" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TicketBoardFiltersBar filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
        <Column minWidth="0" width="full" className="min-h-0 flex-1">
          <Suspense fallback={<TicketBoard.Fallback />}>
            <TicketBoardBody projectId={projectId} filters={filters} onClearFilters={clearFilters} />
          </Suspense>
        </Column>
      </Column>
    </PageContainer>
  );
}
