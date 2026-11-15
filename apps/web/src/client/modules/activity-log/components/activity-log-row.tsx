import { Column } from "@workspace/design-system/components/layout/column";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

import { texts } from "@/client/modules/activity-log/consts/texts.const";
import {
  formatActivityChange,
  formatActivityObject,
  formatActivityWhen,
} from "@/client/modules/activity-log/utils/format-activity-log.util";

type ActivityLogRowProps = {
  entry: ActivityLogType;
};

const sourceBadgeVariant = {
  web: "outline",
  mcp: "secondary",
} as const;

export function ActivityLogRow({ entry }: ActivityLogRowProps) {
  return (
    <Table.Row>
      <Table.Cell>
        <Typography variant="text-sm" weight="medium">
          {entry.actorLabel}
        </Typography>
      </Table.Cell>
      <Table.Cell>
        <Typography variant="text-sm" color="muted">
          {formatActivityWhen(entry.occurredAt)}
        </Typography>
      </Table.Cell>
      <Table.Cell className="whitespace-normal">
        <Column gap="none" minWidth="0">
          <Typography variant="text-sm" weight="medium">
            {formatActivityObject(entry.entityType)}
          </Typography>
          <Typography variant="text-xs" color="muted" font="mono" truncate>
            {entry.entityId}
          </Typography>
        </Column>
      </Table.Cell>
      <Table.Cell>
        <Badge variant={sourceBadgeVariant[entry.source]}>{texts.source[entry.source]}</Badge>
      </Table.Cell>
      <Table.Cell className="whitespace-normal max-w-md">
        <Column gap="xs" minWidth="0">
          <Typography variant="text-sm" weight="medium">
            {entry.action}
          </Typography>
          {entry.changes.map((change) => (
            <Typography key={change.field} variant="text-xs" color="muted">
              {formatActivityChange(change)}
            </Typography>
          ))}
        </Column>
      </Table.Cell>
    </Table.Row>
  );
}