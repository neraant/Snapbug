import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { z } from "zod";

export const createProjectInputDtoSchema = z.object({
  organizationId: z.uuid(),
  name: z.string().min(1),
});

export type CreateProjectInputDtoType = z.infer<typeof createProjectInputDtoSchema>;

export const createProjectOutputDtoSchema = projectModelSchema;

export type CreateProjectOutputDtoType = z.infer<typeof createProjectOutputDtoSchema>;
