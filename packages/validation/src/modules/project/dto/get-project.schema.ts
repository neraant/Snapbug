import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { z } from "zod";

export const getProjectInputDtoSchema = z.object({
  projectId: z.uuid().describe("Project id from list_projects."),
});

export type GetProjectInputDtoType = z.infer<typeof getProjectInputDtoSchema>;

export const getProjectOutputDtoSchema = projectModelSchema;

export type GetProjectOutputDtoType = z.infer<typeof getProjectOutputDtoSchema>;