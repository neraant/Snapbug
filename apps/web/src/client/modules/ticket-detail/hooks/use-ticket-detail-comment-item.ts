import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { commentBodySchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { type BaseSyntheticEvent, type KeyboardEvent, useCallback, useState } from "react";

import { useDeleteComment } from "@/client/modules/shared/queries/use-delete-comment";
import { useUpdateComment } from "@/client/modules/shared/queries/use-update-comment";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

export const editCommentTextareaId = "ticket-detail-comment-edit";

type UseTicketDetailCommentItemInput = {
  commentId: string;
  body: string;
  onDeleted: () => void;
};

export function useTicketDetailCommentItem({ commentId, body, onDeleted }: UseTicketDetailCommentItemInput) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [draftBody, setDraftBody] = useState(body);
  const { mutateAsync: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutateAsync: deleteComment, isPending: isDeleting } = useDeleteComment();

  const trimmedBody = draftBody.trim();
  const canSave = trimmedBody.length > 0 && trimmedBody !== body.trim() && !isUpdating;

  const onEdit = useCallback(() => {
    setDraftBody(body);
    setIsEditing(true);
  }, [body]);

  const onCancel = useCallback(() => {
    setIsEditing(false);
    setDraftBody(body);
  }, [body]);

  const onSave = useCallback(
    async (event?: BaseSyntheticEvent) => {
      event?.preventDefault();
      const parsed = commentBodySchema.safeParse(draftBody);
      if (!parsed.success) {
        return;
      }
      try {
        await updateComment({ id: commentId, body: parsed.data });
        setIsEditing(false);
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.comments.updateError),
          type: "error",
        });
      }
    },
    [commentId, draftBody, updateComment],
  );

  const onDelete = useCallback(async () => {
    setIsRemoving(true);
    try {
      await deleteComment({ id: commentId });
      onDeleted();
    } catch (error) {
      setIsRemoving(false);
      throw error;
    }
  }, [commentId, deleteComment, onDeleted]);

  const onEditKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canSave) {
      event.preventDefault();
      onSave().catch(() => undefined);
    }
  };

  return {
    draftBody,
    setDraftBody,
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
  };
}
