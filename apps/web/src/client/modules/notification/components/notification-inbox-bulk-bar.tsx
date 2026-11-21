import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Spinner } from "@workspace/design-system/components/ui/spinner";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/notification/consts/texts.const";

type NotificationInboxBulkBarProps = {
  count: number;
  pending?: boolean;
  onMarkRead: VoidFunction;
  onArchive: VoidFunction;
  onClear: VoidFunction;
};

export function NotificationInboxBulkBar({
  count,
  pending = false,
  onMarkRead,
  onArchive,
  onClear,
}: NotificationInboxBulkBarProps) {
  return (
    <Row
      align="center"
      justify="between"
      gap="md"
      wrap={false}
      width="full"
      className="rounded-lg border border-border bg-muted/40 px-4 py-2"
    >
      <Typography variant="text-sm" weight="medium">
        {texts.inbox.bulkSelected(count)}
      </Typography>
      <Row align="center" gap="sm" wrap={false}>
        <Button type="button" variant="secondary" size="sm" disabled={pending} onClick={onMarkRead}>
          {pending ? <Spinner className="size-4" /> : texts.inbox.bulkMarkRead}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onArchive}>
          {texts.inbox.bulkArchive}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          {texts.inbox.bulkClear}
        </Button>
      </Row>
    </Row>
  );
}
