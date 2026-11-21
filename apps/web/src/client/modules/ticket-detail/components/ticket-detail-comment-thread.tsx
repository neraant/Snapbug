import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useEffect, useMemo, useRef } from "react";

import { useFindComments } from "@/client/modules/shared/queries/use-find-comments";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { TicketDetailCommentThreadItem } from "@/client/modules/ticket-detail/components/ticket-detail-comment-thread-item";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import {
  TicketDetailCommentSort,
  type TicketDetailCommentSortType,
} from "@/client/modules/ticket-detail/consts/ticket-detail-comment-sort.const";

type TicketDetailCommentThreadProps = {
  bugReportId: string;
  sort: TicketDetailCommentSortType;
  scrollCommentId: string | null;
  onDeleted: VoidFunction;
};

export function TicketDetailCommentThread({
  bugReportId,
  sort,
  scrollCommentId,
  onDeleted,
}: TicketDetailCommentThreadProps) {
  const { data: comments } = useFindComments({ bugReportId });
  const { data: membership } = useFindMembershipByUser();
  const commentRefs = useRef(new Map<string, HTMLElement | null>());

  const orderedComments = useMemo(() => {
    if (sort === TicketDetailCommentSort.NEWEST) {
      return [...comments].reverse();
    }
    return comments;
  }, [comments, sort]);

  useEffect(() => {
    if (!scrollCommentId) return;
    const element = commentRefs.current.get(scrollCommentId);
    element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [scrollCommentId, orderedComments.length]);

  if (comments.length === 0) {
    return (
      <Typography variant="text-sm" color="muted">
        {texts.comments.empty}
      </Typography>
    );
  }

  return (
    <Column gap="lg" width="full" minWidth="0">
      {orderedComments.map((comment) => (
        <TicketDetailCommentThreadItem
          key={comment.id}
          comment={comment}
          canManage={comment.authorUserId === membership?.userId}
          scrollRef={(element) => {
            commentRefs.current.set(comment.id, element);
          }}
          onDeleted={onDeleted}
        />
      ))}
    </Column>
  );
}

function TicketDetailCommentThreadFallback() {
  return (
    <Column gap="lg" width="full">
      {[0, 1].map((index) => (
        <Row key={index} align="start" gap="md" width="full">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Column gap="sm" width="full">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-full" />
          </Column>
        </Row>
      ))}
    </Column>
  );
}

TicketDetailCommentThread.Fallback = TicketDetailCommentThreadFallback;
