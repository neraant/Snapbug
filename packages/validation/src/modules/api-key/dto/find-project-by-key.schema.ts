import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { z } from "zod";

export const findProjectByKeyInputDtoSchema = z.object({
  key: z.string().min(1),
});
export type FindProjectByKeyInputDtoType = z.infer<typeof findProjectByKeyInputDtoSchema>;

export const findProjectByKeyOutputDtoSchema = projectModelSchema.nullable();
export type FindProjectByKeyOutputDtoType = z.infer<typeof findProjectByKeyOutputDtoSchema>;
