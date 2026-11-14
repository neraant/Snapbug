import { TextareaField } from "@workspace/design-system/components/forms/textarea-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { MessageSquareIcon } from "lucide-react";
import { Suspense } from "react";

import { TicketDetailCommentThread } from "@/client/modules/ticket-detail/components/ticket-detail-comment-thread";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailComment } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-comment";

type TicketDetailCommentListProps = {
  bugReportId: string;
};

export function TicketDetailCommentList({ bugReportId }: TicketDetailCommentListProps) {
  const { control, isPending, onSubmit } = useTicketDetailComment({ bugReportId });

  return (
    <Panel width="full" minWidth="0">
      <Panel.Header title={texts.comments.title} description={texts.comments.description} icon={MessageSquareIcon} />
      <Panel.Content>
        <Column gap="lg" width="full" minWidth="0">
          <Suspense fallback={<TicketDetailCommentThread.Fallback />}>
            <TicketDetailCommentThread bugReportId={bugReportId} />
          </Suspense>
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
