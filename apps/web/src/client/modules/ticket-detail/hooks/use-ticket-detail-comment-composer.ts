import { zodResolver } from "@hookform/resolvers/zod";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { addCommentInputDtoSchema } from "@workspace/validation/modules/comment/dto/add-comment.schema";
import { type KeyboardEvent, type RefObject, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useAddComment } from "@/client/modules/shared/queries/use-add-comment";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

const commentFormSchema = addCommentInputDtoSchema.pick({ body: true });

type CommentFormSchemaType = z.infer<typeof commentFormSchema>;

type UseTicketDetailCommentComposerInput = {
  bugReportId: string;
  composerRef: RefObject<HTMLTextAreaElement | null>;
  onCommentAdded: (commentId: string) => void;
};

export function useTicketDetailCommentComposer({
  bugReportId,
  composerRef,
  onCommentAdded,
}: UseTicketDetailCommentComposerInput) {
  const { mutateAsync: addComment, isPending } = useAddComment();
  const [isFocused, setIsFocused] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<CommentFormSchemaType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { body: "" },
  });

  const bodyValue = form.watch("body");
  const showActions = isFocused || bodyValue.trim().length > 0;

  const resetComposer = useCallback(() => {
    form.reset({ body: "" });
    setSubmitError(null);
    setIsFocused(false);
    composerRef.current?.blur();
  }, [composerRef, form]);

  const submitComment = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const created = await addComment({ bugReportId, body: values.body });
      form.reset({ body: "" });
      setIsFocused(false);
      composerRef.current?.blur();
      onCommentAdded(created.id);
    } catch (error) {
      form.setValue("body", values.body, { shouldDirty: true });
      setSubmitError(getAppErrorMessage(error, texts.comments.submitError));
    }
  });

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submitComment().catch(() => undefined);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      resetComposer();
    }
  };

  return {
    control: form.control,
    isPending: isPending || form.formState.isSubmitting,
    isFocused,
    setIsFocused,
    showActions,
    submitError,
    onSubmit: submitComment,
    onCancel: resetComposer,
    onComposerKeyDown,
  };
}
