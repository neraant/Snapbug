import { commentBodySchema, commentModelSchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { z } from "zod";

export const addCommentInputDtoSchema = z.object({
  bugReportId: z.uuid(),
  body: commentBodySchema,
});

export type AddCommentInputDtoType = z.infer<typeof addCommentInputDtoSchema>;

export const addCommentOutputDtoSchema = commentModelSchema;

export type AddCommentOutputDtoType = z.infer<typeof addCommentOutputDtoSchema>;
