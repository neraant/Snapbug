import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { useFindComments } from "@/client/modules/shared/queries/use-find-comments";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { formatTicketDetailExactTimestamp } from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

type TicketDetailCommentThreadProps = {
  bugReportId: string;
};

export function TicketDetailCommentThread({ bugReportId }: TicketDetailCommentThreadProps) {
  const { data: comments } = useFindComments({ bugReportId });

  if (comments.length === 0) {
    return (
      <Typography variant="text-sm" color="muted">
        {texts.comments.empty}
      </Typography>
    );
  }

  return (
    <Column gap="md" width="full" minWidth="0">
      {comments.map((comment) => (
        <Column key={comment.id} gap="xs" width="full" minWidth="0">
          <Row align="center" justify="between" gap="sm" wrap>
            <Typography variant="label">
              {comment.authorName ?? comment.authorEmail ?? texts.comments.unknownAuthor}
            </Typography>
            <Typography variant="text-xs" color="muted">
              {formatTicketDetailExactTimestamp(comment.createdAt)}
            </Typography>
          </Row>
          <Typography variant="text-sm">{comment.body}</Typography>
        </Column>
      ))}
    </Column>
  );
}

function TicketDetailCommentThreadFallback() {
  return <Skeleton className="h-16 w-full" />;
}

TicketDetailCommentThread.Fallback = TicketDetailCommentThreadFallback;
