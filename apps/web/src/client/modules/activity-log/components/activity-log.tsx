import { Column } from "@workspace/design-system/components/layout/column";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { useActivityLog } from "@/client/modules/activity-log/hooks/use-activity-log";
import {
  formatActivityChange,
  formatActivityObject,
  formatActivityWhen,
} from "@/client/modules/activity-log/utils/format-activity-log.util";

export function ActivityLog() {
  const { entries } = useActivityLog();

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>{texts.column.who}</Table.Head>
          <Table.Head>{texts.column.when}</Table.Head>
          <Table.Head>{texts.column.object}</Table.Head>
          <Table.Head>{texts.column.source}</Table.Head>
          <Table.Head>{texts.column.change}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {entries.map((entry) => (
          <Table.Row key={entry.id}>
            <Table.Cell>
              <Typography variant="text-sm">{entry.actorLabel}</Typography>
            </Table.Cell>
            <Table.Cell>
              <Typography variant="text-sm">{formatActivityWhen(entry.occurredAt)}</Typography>
            </Table.Cell>
            <Table.Cell>
              <Typography variant="text-sm">{formatActivityObject(entry.entityType)}</Typography>
            </Table.Cell>
            <Table.Cell>
              <Typography variant="text-sm">{texts.source[entry.source]}</Typography>
            </Table.Cell>
            <Table.Cell>
              <Column gap="none">
                <Typography variant="text-sm">{entry.action}</Typography>
                {entry.changes.map((change) => (
                  <Typography key={change.field} variant="text-xs" color="muted">
                    {formatActivityChange(change)}
                  </Typography>
                ))}
              </Column>
            </Table.Cell>
          </Table.Row>
        ))}
        {entries.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={5}>
              <Typography variant="text-sm" color="muted">
                {texts.empty}
              </Typography>
            </Table.Cell>
          </Table.Row>
        ) : null}
      </Table.Body>
    </Table>
  );
}

function ActivityLogFallback() {
  return (
    <Column gap="sm" width="full">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
    </Column>
  );
}

ActivityLog.Fallback = ActivityLogFallback;
