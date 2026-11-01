import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { StatusIndicator } from "@workspace/design-system/components/ui/status-indicator";

import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { TicketDetailCopyableUrlValue } from "@/client/modules/ticket-detail/components/ticket-detail-copyable-url-value";
import { TicketDetailPropertyRow } from "@/client/modules/ticket-detail/components/ticket-detail-property-row";
import { bugReportSeverityBadgeVariant } from "@/client/modules/ticket-detail/consts/bug-report-severity-badge-variant.const";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { formatTicketDetailExactTimestamp } from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

type TicketDetailSidebarProps = {
  shortId: string;
};

export function TicketDetailSidebar({ shortId }: TicketDetailSidebarProps) {
  const { data: ticket } = useFindBugReport({ shortId });
  const { data: projects } = useFindProjects();

  const projectName = projects.find((project) => project.id === ticket.projectId)?.name ?? "—";
  const assigneeLabel = ticket.assignee?.name?.trim() || texts.sidebar.unassigned;
  const viewport =
    ticket.viewportWidth != null && ticket.viewportHeight != null
      ? `${ticket.viewportWidth} × ${ticket.viewportHeight}`
      : null;

  return (
    <Column gap="lg" width="full" minWidth="0" className="w-full shrink-0 lg:max-w-sm">
      <Panel width="full" minWidth="0">
        <Panel.Header title={texts.sidebar.propertiesTitle} />
        <Panel.Content>
          <Column gap="sm" width="full">
            <TicketDetailPropertyRow
              label={texts.sidebar.status}
              value={
                <Badge variant="secondary">
                  <Row align="center" gap="xs" wrap={false}>
                    <StatusIndicator status={ticket.status} />
                    {texts.statusLabels[ticket.status]}
                  </Row>
                </Badge>
              }
            />
            <TicketDetailPropertyRow
              label={texts.sidebar.severity}
              value={
                <Badge variant={bugReportSeverityBadgeVariant[ticket.severity]}>
                  {texts.severityLabels[ticket.severity]}
                </Badge>
              }
            />
            <TicketDetailPropertyRow label={texts.sidebar.assignee} value={assigneeLabel} />
            <TicketDetailPropertyRow label={texts.sidebar.project} value={projectName} />
            <TicketDetailPropertyRow label={texts.sidebar.reporter} value={ticket.reporterEmail ?? "—"} />
            <TicketDetailPropertyRow
              label={texts.sidebar.created}
              value={formatTicketDetailExactTimestamp(ticket.createdAt)}
            />
            <TicketDetailPropertyRow
              label={texts.sidebar.updated}
              value={formatTicketDetailExactTimestamp(ticket.updatedAt)}
            />
          </Column>
        </Panel.Content>
      </Panel>
      <Panel width="full" minWidth="0">
        <Panel.Header title={texts.sidebar.environmentTitle} />
        <Panel.Content>
          <Column gap="sm" width="full">
            {ticket.browser ? <TicketDetailPropertyRow label={texts.sidebar.browser} value={ticket.browser} /> : null}
            {ticket.os ? <TicketDetailPropertyRow label={texts.sidebar.os} value={ticket.os} /> : null}
            {ticket.device ? <TicketDetailPropertyRow label={texts.sidebar.device} value={ticket.device} /> : null}
            {viewport ? <TicketDetailPropertyRow label={texts.sidebar.viewport} value={viewport} /> : null}
            {ticket.url ? (
              <TicketDetailPropertyRow
                label={texts.sidebar.pageUrl}
                value={<TicketDetailCopyableUrlValue url={ticket.url} />}
              />
            ) : null}
          </Column>
        </Panel.Content>
      </Panel>
    </Column>
  );
}
