import type { DragEndEvent } from "@dnd-kit/core";
import { toast } from "@workspace/design-system/components/ui/toast";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { useCallback, useMemo, useState } from "react";

import { useFindBugReports } from "@/client/modules/shared/queries/use-find-bug-reports";
import { useUpdateBugReport } from "@/client/modules/shared/queries/use-update-bug-report";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { ticketBoardPageSize, ticketBoardStatuses } from "@/client/modules/ticket-board/consts/ticket-board.const";
import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";
import { computeTicketBoardBoardOrder } from "@/client/modules/ticket-board/utils/compute-ticket-board-board-order.util";
import {
  filterTicketBoardReports,
  hasActiveTicketBoardFilters,
} from "@/client/modules/ticket-board/utils/filter-ticket-board-reports.util";
import { groupTicketBoardReportsByStatus } from "@/client/modules/ticket-board/utils/group-ticket-board-reports.util";
import {
  resolveTicketBoardInsertionTarget,
  type TicketBoardInsertionTarget,
} from "@/client/modules/ticket-board/utils/resolve-ticket-board-insertion-target.util";
import { sortTicketBoardColumnReports } from "@/client/modules/ticket-board/utils/sort-ticket-board-column-reports.util";

type ReportPatch = {
  status: BugReportStatus;
  boardOrder: number;
  previousStatus: BugReportStatus;
  previousBoardOrder: number;
};

type UseTicketBoardInput = {
  projectId: string | null;
  filters: TicketBoardFilters;
};

export function useTicketBoard({ projectId, filters }: UseTicketBoardInput) {
  const { data } = useFindBugReports({ projectId: projectId ?? undefined });
  const { mutateAsync: updateBugReport } = useUpdateBugReport();
  const [reportPatches, setReportPatches] = useState<Map<string, ReportPatch>>(new Map());
  const [visibleCountByStatus, setVisibleCountByStatus] = useState<Record<BugReportStatus, number>>(
    () =>
      Object.fromEntries(ticketBoardStatuses.map((status) => [status, ticketBoardPageSize])) as Record<
        BugReportStatus,
        number
      >,
  );

  const reports = useMemo(() => {
    const source = data;
    if (reportPatches.size === 0) {
      return source;
    }

    return source.map((report) => {
      const patch = reportPatches.get(report.id);
      if (!patch) {
        return report;
      }
      return { ...report, status: patch.status, boardOrder: patch.boardOrder };
    });
  }, [data, reportPatches]);

  const filteredReports = useMemo(() => filterTicketBoardReports(reports, filters), [filters, reports]);
  const reportsByStatus = useMemo(() => groupTicketBoardReportsByStatus(filteredReports), [filteredReports]);
  const hasFilters = hasActiveTicketBoardFilters(filters);
  const isEmpty = data.length === 0;
  const isFilteredEmpty = filteredReports.length === 0 && !isEmpty;

  const loadMore = useCallback((status: BugReportStatus) => {
    setVisibleCountByStatus((current) => ({
      ...current,
      [status]: current[status] + ticketBoardPageSize,
    }));
  }, []);

  const applyBoardMove = useCallback(
    async (
      reportId: string,
      nextStatus: BugReportStatus,
      nextBoardOrder: number,
      previousStatus: BugReportStatus,
      previousBoardOrder: number,
      showUndoToast: boolean,
    ) => {
      setReportPatches((current) => {
        const next = new Map(current);
        next.set(reportId, {
          status: nextStatus,
          boardOrder: nextBoardOrder,
          previousStatus,
          previousBoardOrder,
        });
        return next;
      });

      try {
        await updateBugReport({
          id: reportId,
          status: nextStatus,
          boardOrder: nextBoardOrder,
        });
        setReportPatches((current) => {
          const next = new Map(current);
          next.delete(reportId);
          return next;
        });

        if (showUndoToast && previousStatus !== nextStatus) {
          toast.add({
            title: texts.toast.statusUpdated,
            type: "success",
            actionProps: {
              children: texts.toast.undo,
              onClick: () => {
                applyBoardMove(reportId, previousStatus, previousBoardOrder, nextStatus, nextBoardOrder, false).catch(
                  () => undefined,
                );
              },
            },
          });
        }
      } catch {
        setReportPatches((current) => {
          const next = new Map(current);
          next.delete(reportId);
          return next;
        });
        toast.add({
          title: texts.toast.updateFailed,
          type: "error",
        });
      }
    },
    [updateBugReport],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent, insertionTarget: TicketBoardInsertionTarget | null) => {
      const { active, over } = event;
      if (!over) {
        return;
      }

      const resolvedInsertion =
        insertionTarget ??
        resolveTicketBoardInsertionTarget({
          event,
          reportsByStatus,
          visibleCountByStatus,
        });
      if (!resolvedInsertion) {
        return;
      }

      const reportId = String(active.id);
      const report = reports.find((item) => item.id === reportId);
      if (!report) {
        return;
      }

      const { status: nextStatus, index: insertionIndex } = resolvedInsertion;
      const statusChanged = report.status !== nextStatus;
      const targetColumn = sortTicketBoardColumnReports(reports.filter((item) => item.status === nextStatus));
      const activeIndex = targetColumn.findIndex((item) => item.id === reportId);

      if (!statusChanged && activeIndex !== -1 && activeIndex === insertionIndex) {
        return;
      }

      const nextBoardOrder = computeTicketBoardBoardOrder(targetColumn, reportId, insertionIndex);

      if (!statusChanged && report.boardOrder === nextBoardOrder) {
        return;
      }

      applyBoardMove(reportId, nextStatus, nextBoardOrder, report.status, report.boardOrder, statusChanged).catch(
        () => undefined,
      );
    },
    [applyBoardMove, reports, reportsByStatus, visibleCountByStatus],
  );

  return {
    filteredReports,
    reportsByStatus,
    visibleCountByStatus,
    loadMore,
    onDragEnd,
    hasFilters,
    isEmpty,
    isFilteredEmpty,
  };
}
