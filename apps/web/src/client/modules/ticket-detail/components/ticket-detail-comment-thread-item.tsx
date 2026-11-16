import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { Field, FieldError } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Textarea } from "@workspace/design-system/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { CommentAuthorSource } from "@workspace/validation/modules/comment/consts/comment-author-source.const";
import type { CommentModelType } from "@workspace/validation/modules/comment/dto/comment.model";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Controller } from "react-hook-form";

import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { TicketDetailCommentBody } from "@/client/modules/ticket-detail/components/ticket-detail-comment-body";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailCommentItem } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-comment-item";
import {
  formatTicketDetailCommentExactTimestamp,
  formatTicketDetailCommentRelativeTimestamp,
} from "@/client/modules/ticket-detail/utils/format-ticket-detail-comment-timestamp.util";
import { getTicketDetailCommentAuthorInitials } from "@/client/modules/ticket-detail/utils/get-ticket-detail-comment-author-initials.util";

type TicketDetailCommentThreadItemProps = {
  comment: CommentModelType;
  canManage: boolean;
  scrollRef?: (element: HTMLElement | null) => void;
  onDeleted: () => void;
};

export function TicketDetailCommentThreadItem({
  comment,
  canManage,
  scrollRef,
  onDeleted,
}: TicketDetailCommentThreadItemProps) {
  const {
    control,
    isEditing,
    isRemoving,
    isUpdating,
    isDeleting,
    canSave,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    onEditKeyDown,
  } = useTicketDetailCommentItem({
    commentId: comment.id,
    body: comment.body,
    onDeleted,
  });
  const { confirm, bind } = useConfirmDialog();

  const authorName = comment.authorName ?? comment.authorEmail ?? texts.comments.unknownAuthor;
  const isAgent = comment.authorSource === CommentAuthorSource.MCP;
  const isEdited = comment.updatedAt !== null;

  const openDeleteConfirm = () => {
    confirm({
      title: texts.comments.deleteDialog.title,
      description: texts.comments.deleteDialog.description,
      confirmLabel: texts.comments.deleteDialog.confirm,
      variant: "destructive",
      errorFallback: texts.comments.deleteError,
      onConfirm: async () => {
        try {
          await onDelete();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.comments.deleteError));
        }
      },
    });
  };

  return (
    <div ref={scrollRef} className="w-full min-w-0">
      <Row
        align="start"
        gap="md"
        width="full"
        minWidth="0"
        className={cn("group/comment transition-opacity duration-200", isRemoving && "pointer-events-none opacity-0")}
      >
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback>{getTicketDetailCommentAuthorInitials(comment)}</AvatarFallback>
        </Avatar>
        <Column gap="xs" width="full" minWidth="0">
          <Row align="center" justify="between" gap="sm" wrap={false} width="full" minWidth="0">
            <Row align="center" gap="xs" wrap minWidth="0" className="min-w-0">
              <Typography variant="label" truncate>
                {authorName}
              </Typography>
              {isAgent ? (
                <Badge variant="outline" className="shrink-0">
                  {texts.comments.agentBadge}
                </Badge>
              ) : null}
              <Typography variant="text-xs" color="muted" className="shrink-0">
                ·
              </Typography>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Typography variant="text-xs" color="muted" className="shrink-0">
                      {formatTicketDetailCommentRelativeTimestamp(comment.createdAt)}
                    </Typography>
                  }
                />
                <TooltipContent>{formatTicketDetailCommentExactTimestamp(comment.createdAt)}</TooltipContent>
              </Tooltip>
              {isEdited ? (
                <Typography variant="text-xs" color="muted" className="shrink-0">
                  · {texts.comments.edited}
                </Typography>
              ) : null}
            </Row>
            {canManage && !isEditing ? (
              <Row
                align="center"
                gap="xs"
                className="shrink-0 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/comment:opacity-100 [@media(hover:hover)]:group-hover/comment:opacity-100"
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={texts.comments.editAriaLabel}
                        onClick={onEdit}
                      >
                        <PencilIcon />
                      </Button>
                    }
                  />
                  <TooltipContent>{texts.comments.edit}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={texts.comments.deleteAriaLabel}
                        disabled={isDeleting}
                        onClick={openDeleteConfirm}
                      >
                        <Trash2Icon />
                      </Button>
                    }
                  />
                  <TooltipContent>{texts.comments.delete}</TooltipContent>
                </Tooltip>
              </Row>
            ) : null}
          </Row>
          {isEditing ? (
            <Column as="form" gap="sm" width="full" onSubmit={onSave}>
              <Controller
                name="body"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Textarea
                      {...field}
                      aria-label={texts.comments.fieldLabel}
                      rows={4}
                      className="min-h-[4.5rem] resize-none"
                      onKeyDown={onEditKeyDown}
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Row justify="end" gap="sm">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                  {texts.comments.cancel}
                </Button>
                <SubmitButton size="sm" loading={isUpdating} disabled={!canSave}>
                  {texts.comments.save}
                </SubmitButton>
              </Row>
            </Column>
          ) : (
            <TicketDetailCommentBody body={comment.body} />
          )}
        </Column>
      </Row>
      <ConfirmDialog {...bind()} />
    </div>
  );
}
