import { TextareaField } from "@workspace/design-system/components/forms/textarea-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { CommentModelType } from "@workspace/validation/modules/comment/dto/comment.model";

import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailCommentItem } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-comment-item";
import { formatTicketDetailExactTimestamp } from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

type TicketDetailCommentThreadItemProps = {
  comment: CommentModelType;
  canManage: boolean;
};

export function TicketDetailCommentThreadItem({ comment, canManage }: TicketDetailCommentThreadItemProps) {
  const { control, isEditing, isUpdating, isDeleting, onEdit, onCancel, onSave, onDelete } = useTicketDetailCommentItem(
    {
      commentId: comment.id,
      body: comment.body,
    },
  );
  const { confirm, bind } = useConfirmDialog();

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
    <Column gap="xs" width="full" minWidth="0">
      <Row align="center" justify="between" gap="sm" wrap width="full">
        <Typography variant="label">
          {comment.authorName ?? comment.authorEmail ?? texts.comments.unknownAuthor}
        </Typography>
        <Row align="center" gap="sm" wrap>
          <Typography variant="text-xs" color="muted">
            {formatTicketDetailExactTimestamp(comment.createdAt)}
          </Typography>
          {canManage && !isEditing ? (
            <Row align="center" gap="xs">
              <Button type="button" variant="ghost" size="sm" className="h-auto px-1" onClick={onEdit}>
                {texts.comments.edit}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto px-1"
                disabled={isDeleting}
                onClick={openDeleteConfirm}
              >
                {texts.comments.delete}
              </Button>
            </Row>
          ) : null}
        </Row>
      </Row>
      {isEditing ? (
        <Column as="form" gap="sm" width="full" onSubmit={onSave}>
          <TextareaField control={control} name="body" label={texts.comments.fieldLabel} />
          <Row justify="end" gap="sm">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              {texts.comments.cancel}
            </Button>
            <SubmitButton size="sm" loading={isUpdating}>
              {texts.comments.save}
            </SubmitButton>
          </Row>
        </Column>
      ) : (
        <Typography variant="text-sm">{comment.body}</Typography>
      )}
      <ConfirmDialog {...bind()} />
    </Column>
  );
}
