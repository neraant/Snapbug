import { Column } from "@workspace/design-system/components/layout/column";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { ActivityLogRow } from "@/client/modules/activity-log/components/activity-log-row";
import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { useActivityLog } from "@/client/modules/activity-log/hooks/use-activity-log";

export function ActivityLog() {
  const { entries } = useActivityLog();

  return (
    <Column gap="lg" width="full">
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
            <ActivityLogRow key={entry.id} entry={entry} />
          ))}
          {entries.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5}>
                <Typography variant="text-sm" color="muted" align="center">
                  {texts.empty}
                </Typography>
              </Table.Cell>
            </Table.Row>
          ) : null}
        </Table.Body>
      </Table>
    </Column>
  );
}

function ActivityLogFallback() {
  return (
    <Column gap="lg" width="full">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
    </Column>
  );
}

ActivityLog.Fallback = ActivityLogFallback;
