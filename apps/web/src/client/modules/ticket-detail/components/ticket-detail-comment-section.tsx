import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { TicketDetailCommentList } from "@/client/modules/ticket-detail/components/ticket-detail-comment-list";

type TicketDetailCommentSectionProps = {
  shortId: string;
};

export function TicketDetailCommentSection({ shortId }: TicketDetailCommentSectionProps) {
  const { data: ticket } = useFindBugReport({ shortId });

  return <TicketDetailCommentList bugReportId={ticket.id} />;
}
