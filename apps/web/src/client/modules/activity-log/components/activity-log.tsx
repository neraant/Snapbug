"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useEffect, useMemo, useRef } from "react";

import { ActivityLogDetailSheet } from "@/client/modules/activity-log/components/activity-log-detail-sheet";
import { ActivityLogRow } from "@/client/modules/activity-log/components/activity-log-row";
import { ActivityLogToolbar } from "@/client/modules/activity-log/components/activity-log-toolbar";
import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { useActivityLog } from "@/client/modules/activity-log/hooks/use-activity-log";
import { useActivityLogDetail } from "@/client/modules/activity-log/hooks/use-activity-log-detail";
import { formatActivityDayLabel } from "@/client/modules/activity-log/utils/format-activity-log.util";

function groupEntriesWithDayDividers(entries: ReturnType<typeof useActivityLog>["entries"]) {
  const rows: Array<
    { kind: "divider"; key: string; label: string } | { kind: "entry"; key: string; entry: (typeof entries)[number] }
  > = [];

  let previousDayLabel: string | null = null;

  for (const entry of entries) {
    const label = formatActivityDayLabel(entry.occurredAt);
    if (previousDayLabel !== label) {
      rows.push({ kind: "divider", key: `day-${label}-${entry.id}`, label });
      previousDayLabel = label;
    }
    rows.push({ kind: "entry", key: entry.id, entry });
  }

  return rows;
}

const ACTIVITY_LOG_COLUMNS = 4;

export function ActivityLog() {
  const {
    entries,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    selectedEventId,
    setSelectedEventId,
    selectedEntry,
    actorOptions,
    query,
  } = useActivityLog();

  const { canMovePrevious, canMoveNext, movePrevious, moveNext } = useActivityLogDetail({
    entries,
    selectedEventId,
    setSelectedEventId,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => groupEntriesWithDayDividers(entries), [entries]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !query.hasNextPage) return;

    const observer = new IntersectionObserver(
      (records) => {
        const [record] = records;
        if (record?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage().catch(() => undefined);
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [query, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const isInitialLoading = query.isLoading;
  const isEmpty = !isInitialLoading && entries.length === 0;
  const sheetOpen = Boolean(selectedEventId && selectedEntry);

  return (
    <Column gap="lg" width="full" className="min-h-0 min-w-0 flex-1">
      <Table.Toolbar>
        <ActivityLogToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          actorOptions={actorOptions}
        />
      </Table.Toolbar>

      {query.isError && entries.length === 0 ? (
        <Table.Shell>
          <Table.Error
            message={texts.loadMoreError}
            retryLabel={texts.retry}
            onRetry={() => {
              query.refetch().catch(() => undefined);
            }}
          />
        </Table.Shell>
      ) : isEmpty ? (
        <Table.Shell>
          <Table.Empty
            message={hasActiveFilters ? texts.emptyFiltered : texts.empty}
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  {texts.clearFilters}
                </Button>
              ) : undefined
            }
          />
        </Table.Shell>
      ) : (
        <Table.Shell className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Table.Scroll className="min-h-0 flex-1">
            <Table className="border-0">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-28">{texts.column.when}</Table.Head>
                  <Table.Head className="w-44">{texts.column.actor}</Table.Head>
                  <Table.Head>{texts.column.event}</Table.Head>
                  <Table.Head className="w-32">{texts.column.object}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isInitialLoading ? <Table.Loading colSpan={ACTIVITY_LOG_COLUMNS} /> : null}
                {!isInitialLoading
                  ? rows.map((row) =>
                      row.kind === "divider" ? (
                        <Table.Row key={row.key} className="bg-muted/30 hover:bg-muted/30">
                          <Table.Cell colSpan={4} className="sticky top-10 z-[5] bg-muted/30 py-2">
                            <Typography variant="text-xs" color="muted" weight="medium">
                              {row.label}
                            </Typography>
                          </Table.Cell>
                        </Table.Row>
                      ) : (
                        <ActivityLogRow
                          key={row.key}
                          entry={row.entry}
                          selected={selectedEventId === row.entry.id}
                          onOpen={() => setSelectedEventId(row.entry.id)}
                        />
                      ),
                    )
                  : null}

                {query.isFetchingNextPage ? <Table.Loading colSpan={ACTIVITY_LOG_COLUMNS} rows={3} /> : null}

                {query.isFetchNextPageError ? (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Row align="center" justify="center" gap="sm" width="full" className="py-2">
                        <Typography variant="text-sm" color="muted">
                          {texts.loadMoreError}
                        </Typography>
                        <Typography variant="text-sm" color="muted">
                          ·
                        </Typography>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => query.fetchNextPage().catch(() => undefined)}
                        >
                          {texts.retry}
                        </Button>
                      </Row>
                    </Table.Cell>
                  </Table.Row>
                ) : null}

                {!query.hasNextPage && entries.length > 0 && !isInitialLoading ? (
                  <Table.Row className="hover:bg-transparent">
                    <Table.Cell colSpan={4}>
                      <Typography variant="text-xs" color="muted" align="center" className="py-2">
                        {texts.endOfList}
                      </Typography>
                    </Table.Cell>
                  </Table.Row>
                ) : null}
              </Table.Body>
            </Table>
            <div ref={sentinelRef} aria-hidden className="h-px w-full" />
          </Table.Scroll>
        </Table.Shell>
      )}

      <ActivityLogDetailSheet
        entry={selectedEntry}
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedEventId(null);
        }}
        canMovePrevious={canMovePrevious}
        canMoveNext={canMoveNext}
        onPrevious={movePrevious}
        onNext={moveNext}
      />
    </Column>
  );
}

function ActivityLogFallback() {
  return (
    <Column gap="lg" width="full">
      <Skeleton className="h-10 w-full max-w-xl" />
      <Skeleton className="h-[420px] w-full" />
    </Column>
  );
}

ActivityLog.Fallback = ActivityLogFallback;
