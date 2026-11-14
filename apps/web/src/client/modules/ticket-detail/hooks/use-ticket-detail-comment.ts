import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { addCommentInputDtoSchema } from "@workspace/validation/modules/comment/dto/add-comment.schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useAddComment } from "@/client/modules/shared/queries/use-add-comment";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

const commentFormSchema = addCommentInputDtoSchema.pick({ body: true });

type CommentFormSchemaType = z.infer<typeof commentFormSchema>;

type UseTicketDetailCommentInput = {
  bugReportId: string;
};

export function useTicketDetailComment({ bugReportId }: UseTicketDetailCommentInput) {
  const { mutateAsync: addComment, isPending } = useAddComment();
  const form = useForm<CommentFormSchemaType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { body: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const pending = addComment({ bugReportId, body: values.body });
      form.reset();
      await pending;
    } catch (error) {
      form.setValue("body", values.body);
      toast.add({
        title: getAppErrorMessage(error, texts.comments.submitError),
        type: "error",
      });
    }
  });

  return {
    control: form.control,
    isPending: isPending || form.formState.isSubmitting,
    onSubmit,
  };
}
