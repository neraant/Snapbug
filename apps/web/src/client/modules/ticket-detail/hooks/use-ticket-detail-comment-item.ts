import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { commentBodySchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { type KeyboardEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDeleteComment } from "@/client/modules/shared/queries/use-delete-comment";
import { useUpdateComment } from "@/client/modules/shared/queries/use-update-comment";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

const editCommentFormSchema = z.object({ body: commentBodySchema });

type EditCommentFormSchemaType = z.infer<typeof editCommentFormSchema>;

type UseTicketDetailCommentItemInput = {
  commentId: string;
  body: string;
  onDeleted: () => void;
};

export function useTicketDetailCommentItem({ commentId, body, onDeleted }: UseTicketDetailCommentItemInput) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { mutateAsync: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutateAsync: deleteComment, isPending: isDeleting } = useDeleteComment();
  const form = useForm<EditCommentFormSchemaType>({
    resolver: zodResolver(editCommentFormSchema),
    defaultValues: { body },
  });

  const trimmedBody = form.watch("body").trim();
  const canSave = trimmedBody.length > 0 && trimmedBody !== body.trim() && !isUpdating;

  const onEdit = useCallback(() => {
    form.reset({ body });
    setIsEditing(true);
  }, [body, form]);

  const onCancel = useCallback(() => {
    setIsEditing(false);
    form.reset({ body });
  }, [body, form]);

  const onSave = form.handleSubmit(async (values) => {
    try {
      await updateComment({ id: commentId, body: values.body });
      setIsEditing(false);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.comments.updateError),
        type: "error",
      });
    }
  });

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
    control: form.control,
    isEditing,
    isRemoving,
    isUpdating: isUpdating || form.formState.isSubmitting,
    isDeleting,
    canSave,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    onEditKeyDown,
  };
}
