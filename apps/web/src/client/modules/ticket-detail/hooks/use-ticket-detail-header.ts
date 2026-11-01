import { toast } from "@workspace/design-system/components/ui/toast";
import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { useCallback } from "react";

import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { useUpdateBugReport } from "@/client/modules/shared/queries/use-update-bug-report";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

type UseTicketDetailHeaderInput = {
  shortId: string;
};

export function useTicketDetailHeader({ shortId }: UseTicketDetailHeaderInput) {
  const { data: ticket } = useFindBugReport({ shortId });
  const { mutateAsync: updateBugReport, isPending } = useUpdateBugReport();

  const updateStatus = useCallback(
    async (status: BugReportStatus) => {
      if (status === ticket.status) return;

      try {
        await updateBugReport({ id: ticket.id, status });
        toast.add({ title: texts.toast.statusUpdated, type: "success" });
      } catch {
        toast.add({ title: texts.toast.updateFailed, type: "error" });
      }
    },
    [ticket.id, ticket.status, updateBugReport],
  );

  const updateSeverity = useCallback(
    async (severity: BugReportSeverity) => {
      if (severity === ticket.severity) return;

      try {
        await updateBugReport({ id: ticket.id, severity });
        toast.add({ title: texts.toast.severityUpdated, type: "success" });
      } catch {
        toast.add({ title: texts.toast.updateFailed, type: "error" });
      }
    },
    [ticket.id, ticket.severity, updateBugReport],
  );

  return {
    ticket,
    isPending,
    updateStatus,
    updateSeverity,
  };
}
