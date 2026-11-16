import { Column } from "@workspace/design-system/components/layout/column";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl, type SegmentedControlItem } from "@workspace/design-system/components/ui/segmented-control";
import { MessageSquareIcon } from "lucide-react";
import { Suspense, useMemo, useState } from "react";

import { useFindComments } from "@/client/modules/shared/queries/use-find-comments";
import { TicketDetailCommentComposer } from "@/client/modules/ticket-detail/components/ticket-detail-comment-composer";
import { TicketDetailCommentThread } from "@/client/modules/ticket-detail/components/ticket-detail-comment-thread";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import {
  TicketDetailCommentSort,
  type TicketDetailCommentSortType,
} from "@/client/modules/ticket-detail/consts/ticket-detail-comment-sort.const";

type TicketDetailCommentListProps = {
  bugReportId: string;
};

function TicketDetailCommentHeader({
  bugReportId,
  sort,
  onSortChange,
}: {
  bugReportId: string;
  sort: TicketDetailCommentSortType;
  onSortChange: (value: TicketDetailCommentSortType) => void;
}) {
  const { data: comments } = useFindComments({ bugReportId });

  const sortItems = useMemo<SegmentedControlItem[]>(
    () => [
      { value: TicketDetailCommentSort.OLDEST, label: texts.comments.sortOldest },
      { value: TicketDetailCommentSort.NEWEST, label: texts.comments.sortNewest },
    ],
    [],
  );

  return (
    <Panel.Header
      title={`${texts.comments.title} ${texts.comments.count(comments.length)}`}
      description={texts.comments.description}
      icon={MessageSquareIcon}
      action={
        comments.length > 1 ? (
          <SegmentedControl
            size="sm"
            aria-label={texts.comments.title}
            items={sortItems}
            value={sort}
            onValueChange={(value) => onSortChange(value as TicketDetailCommentSortType)}
          />
        ) : null
      }
    />
  );
}

function TicketDetailCommentHeaderFallback() {
  return (
    <Panel.Header title={texts.comments.title} description={texts.comments.description} icon={MessageSquareIcon} />
  );
}

export function TicketDetailCommentList({ bugReportId }: TicketDetailCommentListProps) {
  const [sort, setSort] = useState<TicketDetailCommentSortType>(TicketDetailCommentSort.OLDEST);
  const [scrollCommentId, setScrollCommentId] = useState<string | null>(null);

  const focusComposer = () => {
    document.getElementById("commentBody")?.focus();
  };

  return (
    <Panel width="full" minWidth="0">
      <Suspense fallback={<TicketDetailCommentHeaderFallback />}>
        <TicketDetailCommentHeader bugReportId={bugReportId} sort={sort} onSortChange={setSort} />
      </Suspense>
      <Panel.Content>
        <Column gap="lg" width="full" minWidth="0">
          <Suspense fallback={<TicketDetailCommentThread.Fallback />}>
            <TicketDetailCommentThread
              bugReportId={bugReportId}
              sort={sort}
              scrollCommentId={scrollCommentId}
              onDeleted={focusComposer}
            />
          </Suspense>
          <Suspense fallback={<TicketDetailCommentComposer.Fallback />}>
            <TicketDetailCommentComposer
              bugReportId={bugReportId}
              onCommentAdded={(commentId) => setScrollCommentId(commentId)}
            />
          </Suspense>
        </Column>
      </Panel.Content>
    </Panel>
  );
}
