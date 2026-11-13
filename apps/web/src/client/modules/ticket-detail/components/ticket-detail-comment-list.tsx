import { TextareaField } from "@workspace/design-system/components/forms/textarea-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { MessageSquareIcon } from "lucide-react";

import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailComment } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-comment";
import { formatTicketDetailExactTimestamp } from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

type TicketDetailCommentListProps = {
  bugReportId: string;
};

export function TicketDetailCommentList({ bugReportId }: TicketDetailCommentListProps) {
  const { comments, control, isPending, onSubmit } = useTicketDetailComment({ bugReportId });

  return (
    <Panel width="full" minWidth="0">
      <Panel.Header title={texts.comments.title} description={texts.comments.description} icon={MessageSquareIcon} />
      <Panel.Content>
        <Column gap="lg" width="full" minWidth="0">
          {comments.length === 0 ? (
            <Typography variant="text-sm" color="muted">
              {texts.comments.empty}
            </Typography>
          ) : (
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
          )}
          <Column as="form" gap="md" width="full" onSubmit={onSubmit}>
            <TextareaField control={control} name="body" label={texts.comments.fieldLabel} />
            <Row justify="end">
              <SubmitButton loading={isPending}>{texts.comments.submit}</SubmitButton>
            </Row>
          </Column>
        </Column>
      </Panel.Content>
    </Panel>
  );
}
