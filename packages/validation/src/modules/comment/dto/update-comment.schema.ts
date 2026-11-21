import { commentBodySchema, commentModelSchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { z } from "zod";

export const updateCommentInputDtoSchema = z.object({
  id: commentModelSchema.shape.id,
  body: commentBodySchema,
});

export type UpdateCommentInputDtoType = z.infer<typeof updateCommentInputDtoSchema>;

export const updateCommentOutputDtoSchema = commentModelSchema;

export type UpdateCommentOutputDtoType = z.infer<typeof updateCommentOutputDtoSchema>;
