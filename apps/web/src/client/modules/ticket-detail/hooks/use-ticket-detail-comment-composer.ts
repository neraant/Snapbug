import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { commentBodySchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { type BaseSyntheticEvent, type KeyboardEvent, useCallback, useState } from "react";

import { useAddComment } from "@/client/modules/shared/queries/use-add-comment";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

type UseTicketDetailCommentComposerInput = {
  bugReportId: string;
  onCommentAdded: (commentId: string) => void;
};

export function useTicketDetailCommentComposer({ bugReportId, onCommentAdded }: UseTicketDetailCommentComposerInput) {
  const { mutateAsync: addComment, isPending } = useAddComment();
  const [isFocused, setIsFocused] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const showActions = isFocused || draftBody.trim().length > 0;

  const resetComposer = useCallback(() => {
    setDraftBody("");
    setFieldError(null);
    setSubmitError(null);
    setIsFocused(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const submitComment = useCallback(
    async (event?: BaseSyntheticEvent) => {
      event?.preventDefault();
      setSubmitError(null);
      const parsed = commentBodySchema.safeParse(draftBody);
      if (!parsed.success) {
        setFieldError(parsed.error.issues[0]?.message ?? texts.comments.submitError);
        return;
      }
      setFieldError(null);
      try {
        const created = await addComment({ bugReportId, body: parsed.data });
        setDraftBody("");
        setIsFocused(false);
        onCommentAdded(created.id);
      } catch (error) {
        setSubmitError(getAppErrorMessage(error, texts.comments.submitError));
      }
    },
    [addComment, bugReportId, draftBody, onCommentAdded],
  );

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
    draftBody,
    setDraftBody,
    fieldError,
    isPending,
    isFocused,
    setIsFocused,
    showActions,
    submitError,
    onSubmit: submitComment,
    onCancel: resetComposer,
    onComposerKeyDown,
  };
}
