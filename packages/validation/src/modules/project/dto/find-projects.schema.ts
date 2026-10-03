import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { z } from "zod";

export const findProjectsInputDtoSchema = z.object({
  organizationId: z.uuid(),
});
export type FindProjectsInputDtoType = z.infer<typeof findProjectsInputDtoSchema>;

export const findProjectsOutputDtoSchema = projectModelSchema.array();
export type FindProjectsOutputDtoType = z.infer<typeof findProjectsOutputDtoSchema>;
