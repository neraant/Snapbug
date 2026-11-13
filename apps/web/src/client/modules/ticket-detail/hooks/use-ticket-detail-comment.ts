import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { addCommentInputDtoSchema } from "@workspace/validation/modules/comment/dto/add-comment.schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useAddComment } from "@/client/modules/shared/queries/use-add-comment";
import { useFindComments } from "@/client/modules/shared/queries/use-find-comments";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

const commentFormSchema = addCommentInputDtoSchema.pick({ body: true });

type CommentFormSchemaType = z.infer<typeof commentFormSchema>;

type UseTicketDetailCommentInput = {
  bugReportId: string;
};

export function useTicketDetailComment({ bugReportId }: UseTicketDetailCommentInput) {
  const { data: comments } = useFindComments({ bugReportId });
  const { mutateAsync: addComment, isPending } = useAddComment();
  const form = useForm<CommentFormSchemaType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { body: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await addComment({ bugReportId, body: values.body });
      form.reset();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.comments.submitError),
        type: "error",
      });
    }
  });

  return {
    comments,
    control: form.control,
    isPending: isPending || form.formState.isSubmitting,
    onSubmit,
  };
}
