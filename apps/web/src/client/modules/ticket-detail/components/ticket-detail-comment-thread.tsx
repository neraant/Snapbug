import { Column } from "@workspace/design-system/components/layout/column";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { Fragment } from "react";

import { useFindComments } from "@/client/modules/shared/queries/use-find-comments";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { TicketDetailCommentThreadItem } from "@/client/modules/ticket-detail/components/ticket-detail-comment-thread-item";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

type TicketDetailCommentThreadProps = {
  bugReportId: string;
};

export function TicketDetailCommentThread({ bugReportId }: TicketDetailCommentThreadProps) {
  const { data: comments } = useFindComments({ bugReportId });
  const { data: membership } = useFindMembershipByUser();

  if (comments.length === 0) {
    return (
      <Typography variant="text-sm" color="muted">
        {texts.comments.empty}
      </Typography>
    );
  }

  return (
    <Column gap="md" width="full" minWidth="0">
      {comments.map((comment, index) => (
        <Fragment key={comment.id}>
          {index > 0 ? <Separator /> : null}
          <TicketDetailCommentThreadItem
            comment={comment}
            canManage={comment.authorUserId === membership?.userId}
          />
        </Fragment>
      ))}
    </Column>
  );
}

function TicketDetailCommentThreadFallback() {
  return <Skeleton className="h-16 w-full" />;
}

TicketDetailCommentThread.Fallback = TicketDetailCommentThreadFallback;