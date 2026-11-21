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
  onCancel: VoidFunction;
};

export function NotificationInboxBulkBar({
  count,
  pending = false,
  onMarkRead,
  onArchive,
  onCancel,
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
      <Row align="center" gap="sm" wrap>
        <Typography variant="text-sm" weight="medium">
          {texts.inbox.bulkSelected(count)}
        </Typography>
        <Typography variant="text-sm" color="muted" aria-hidden>
          ·
        </Typography>
        <Button type="button" variant="link" size="sm" className="h-auto px-0" disabled={pending} onClick={onMarkRead}>
          {pending ? <Spinner className="size-4" /> : texts.inbox.bulkMarkRead}
        </Button>
        <Typography variant="text-sm" color="muted" aria-hidden>
          ·
        </Typography>
        <Button type="button" variant="link" size="sm" className="h-auto px-0" disabled={pending} onClick={onArchive}>
          {texts.inbox.bulkArchive}
        </Button>
        <Typography variant="text-sm" color="muted" aria-hidden>
          ·
        </Typography>
        <Button type="button" variant="link" size="sm" className="h-auto px-0" onClick={onCancel}>
          {texts.inbox.bulkCancel}
        </Button>
      </Row>
    </Row>
  );
}
