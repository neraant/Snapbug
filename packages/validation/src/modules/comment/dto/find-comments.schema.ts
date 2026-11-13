import { commentModelSchema } from "@workspace/validation/modules/comment/dto/comment.model";
import { z } from "zod";

export const findCommentsInputDtoSchema = z.object({
  bugReportId: z.uuid(),
});

export type FindCommentsInputDtoType = z.infer<typeof findCommentsInputDtoSchema>;

export const findCommentsOutputDtoSchema = z.array(commentModelSchema);

export type FindCommentsOutputDtoType = z.infer<typeof findCommentsOutputDtoSchema>;
