import { commentBodySchema, commentModelSchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { z } from "zod";

export const addCommentInputDtoSchema = z.object({
  bugReportId: z.uuid().describe("Ticket uuid from get_ticket."),
  body: commentBodySchema.describe("Markdown comment text."),
});

export type AddCommentInputDtoType = z.infer<typeof addCommentInputDtoSchema>;

export const addCommentOutputDtoSchema = commentModelSchema;

export type AddCommentOutputDtoType = z.infer<typeof addCommentOutputDtoSchema>;
