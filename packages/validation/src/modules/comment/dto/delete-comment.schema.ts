import { commentModelSchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { z } from "zod";

export const deleteCommentInputDtoSchema = z.object({
  id: commentModelSchema.shape.id,
});

export type DeleteCommentInputDtoType = z.infer<typeof deleteCommentInputDtoSchema>;

export const deleteCommentOutputDtoSchema = z.void();

export type DeleteCommentOutputDtoType = z.infer<typeof deleteCommentOutputDtoSchema>;