import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldError } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Textarea } from "@workspace/design-system/components/ui/textarea";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { RefObject } from "react";
import { Controller } from "react-hook-form";

import { useFindCurrentUser } from "@/client/modules/shared/queries/use-find-current-user";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailCommentComposer } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-comment-composer";

type TicketDetailCommentComposerProps = {
  bugReportId: string;
  composerRef: RefObject<HTMLTextAreaElement | null>;
  onCommentAdded: (commentId: string) => void;
};

function getCurrentUserInitials(name: string | null, email: string): string {
  const source = name?.trim() || email.trim();
  const [first] = source;
  return (first ?? "?").toUpperCase();
}

export function TicketDetailCommentComposer({
  bugReportId,
  composerRef,
  onCommentAdded,
}: TicketDetailCommentComposerProps) {
  const { data: currentUser } = useFindCurrentUser();
  const {
    control,
    isPending,
    isFocused,
    setIsFocused,
    showActions,
    submitError,
    onSubmit,
    onCancel,
    onComposerKeyDown,
  } = useTicketDetailCommentComposer({ bugReportId, composerRef, onCommentAdded });

  return (
    <Column as="form" gap="md" width="full" minWidth="0" onSubmit={onSubmit}>
      <Row align="start" gap="md" width="full" minWidth="0">
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback>{getCurrentUserInitials(currentUser.name, currentUser.email)}</AvatarFallback>
        </Avatar>
        <Column gap="xs" width="full" minWidth="0">
          <Controller
            name="body"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  ref={(node) => {
                    field.ref(node);
                    composerRef.current = node;
                  }}
                  id="ticket-detail-comment-composer"
                  aria-label={texts.comments.fieldLabel}
                  placeholder={texts.comments.placeholder}
                  rows={isFocused || field.value.trim().length > 0 ? 3 : 1}
                  className={cn(
                    "min-h-9 resize-none",
                    (isFocused || field.value.trim().length > 0) && "min-h-[4.5rem]",
                  )}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={onComposerKeyDown}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
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
