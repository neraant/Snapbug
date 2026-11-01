import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { StatusIndicator } from "@workspace/design-system/components/ui/status-indicator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { bugReportSeverities } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { bugReportStatuses } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { formatDistance } from "date-fns";

import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { bugReportSeverityBadgeVariant } from "@/client/modules/ticket-detail/consts/bug-report-severity-badge-variant.const";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailHeader } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-header";
import { formatTicketDetailExactTimestamp } from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

type TicketDetailHeaderProps = {
  shortId: string;
};

export function TicketDetailHeader({ shortId }: TicketDetailHeaderProps) {
  const { ticket, isPending, updateStatus, updateSeverity } = useTicketDetailHeader({ shortId });
  const { data: projects } = useFindProjects();
  const projectName = projects.find((project) => project.id === ticket.projectId)?.name ?? "—";
  const createdRelative = formatDistance(new Date(ticket.createdAt), new Date(), { addSuffix: true });
  const createdExact = formatTicketDetailExactTimestamp(ticket.createdAt);

  return (
    <Column gap="md" width="full" minWidth="0">
      <Row align="center" justify="between" gap="md" wrap>
        <Column gap="sm" minWidth="0">
          <Row align="center" gap="sm" wrap>
            <Typography variant="text-sm" color="muted" font="mono">
              {ticket.shortId}
            </Typography>
            <Badge variant="secondary">
              <Row align="center" gap="xs" wrap={false}>
                <StatusIndicator status={ticket.status} />
                {texts.statusLabels[ticket.status]}
              </Row>
            </Badge>
            <Badge variant={bugReportSeverityBadgeVariant[ticket.severity]}>
              {texts.severityLabels[ticket.severity]}
            </Badge>
          </Row>
          <Row align="center" gap="sm" wrap>
            <Typography variant="text-xs" color="muted">
              {projectName}
            </Typography>
            {ticket.reporterEmail ? (
              <>
                <Typography variant="text-xs" color="muted">
                  ·
                </Typography>
                <Typography variant="text-xs" color="muted">
                  {ticket.reporterEmail}
                </Typography>
              </>
            ) : null}
            <Typography variant="text-xs" color="muted">
              ·
            </Typography>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Typography variant="text-xs" color="muted" className="cursor-default">
                    {createdRelative}
                  </Typography>
                }
              />
              <TooltipContent>{createdExact}</TooltipContent>
            </Tooltip>
          </Row>
        </Column>

        <Row align="center" gap="sm" wrap={false} className="shrink-0">
          <Select
            value={ticket.status}
            onValueChange={(value) => {
              if (value) updateStatus(value as BugReportStatus).catch(() => undefined);
            }}
            disabled={isPending}
          >
            <SelectTrigger aria-label={texts.header.statusAriaLabel} className="w-40">
              <SelectValue>
                {(value) =>
                  value ? (
                    <Row align="center" gap="xs" wrap={false}>
                      <StatusIndicator status={value} />
                      {texts.statusLabels[value as BugReportStatus]}
                    </Row>
                  ) : null
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {bugReportStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  <Row align="center" gap="xs" wrap={false}>
                    <StatusIndicator status={status} />
                    {texts.statusLabels[status]}
                  </Row>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={ticket.severity}
            onValueChange={(value) => {
              if (value) updateSeverity(value as BugReportSeverity).catch(() => undefined);
            }}
            disabled={isPending}
          >
            <SelectTrigger aria-label={texts.header.severityAriaLabel} className="w-36">
              <SelectValue>{(value) => (value ? texts.severityLabels[value as BugReportSeverity] : null)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {bugReportSeverities.map((severity) => (
                <SelectItem key={severity} value={severity}>
                  {texts.severityLabels[severity]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
      </Row>

      <Typography variant="heading-md" font="heading" weight="semibold" truncate>
        {ticket.title}
      </Typography>
    </Column>
  );
}
