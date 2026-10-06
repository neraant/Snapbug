import { z } from "zod";

export const updateProjectInputDtoSchema = z.object({
  projectId: z.uuid(),
  name: z.string().min(1),
});

export type UpdateProjectInputDtoType = z.infer<typeof updateProjectInputDtoSchema>;
