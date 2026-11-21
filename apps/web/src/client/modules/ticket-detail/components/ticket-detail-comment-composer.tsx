import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldError, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Textarea } from "@workspace/design-system/components/ui/textarea";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";

import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailCommentComposer } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-comment-composer";

type TicketDetailCommentComposerProps = {
  bugReportId: string;
  onCommentAdded: (commentId: string) => void;
};

export function TicketDetailCommentComposer({ bugReportId, onCommentAdded }: TicketDetailCommentComposerProps) {
  const {
    draftBody,
    setDraftBody,
    fieldError,
    isPending,
    isFocused,
    setIsFocused,
    showActions,
    submitError,
    onSubmit,
    onCancel,
    onComposerKeyDown,
  } = useTicketDetailCommentComposer({ bugReportId, onCommentAdded });

  const expanded = isFocused || draftBody.trim().length > 0;

  return (
    <Column as="form" gap="md" width="full" minWidth="0" noValidate onSubmit={onSubmit}>
      <Row align="start" gap="md" width="full" minWidth="0">
        <Column gap="xs" width="full" minWidth="0">
          <Field data-invalid={Boolean(fieldError)}>
            <FieldLabel htmlFor="commentBody">{texts.comments.fieldLabel}</FieldLabel>
            <Textarea
              id="commentBody"
              name="commentBody"
              value={draftBody}
              onChange={(event) => setDraftBody(event.target.value)}
              placeholder={texts.comments.placeholder}
              rows={expanded ? 3 : 1}
              className={cn("min-h-9 resize-none", expanded && "min-h-[4.5rem]")}
              onFocus={() => setIsFocused(true)}
              onKeyDown={onComposerKeyDown}
            />
            {fieldError ? <FieldError errors={[{ message: fieldError }]} /> : null}
          </Field>
          {submitError ? (
            <Typography variant="text-sm" color="destructive">
              {submitError}
            </Typography>
          ) : null}
          {showActions ? (
            <Row align="center" justify="between" gap="sm" wrap width="full">
              <Row align="center" gap="sm">
                <SubmitButton loading={isPending}>{texts.comments.submit}</SubmitButton>
                <Button type="button" variant="ghost" onClick={onCancel}>
                  {texts.comments.cancel}
                </Button>
              </Row>
              <Typography variant="text-xs" color="muted" className="text-right">
                {texts.comments.composerHint}
              </Typography>
            </Row>
          ) : null}
        </Column>
      </Row>
    </Column>
  );
}

function TicketDetailCommentComposerFallback() {
  return (
    <Row align="start" gap="md" width="full">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-20 w-full" />
    </Row>
  );
}

TicketDetailCommentComposer.Fallback = TicketDetailCommentComposerFallback;
