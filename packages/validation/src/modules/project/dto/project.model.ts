import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { z } from "zod";

export const projectModelSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  color: projectColorSchema,
  organizationId: z.uuid(),
  createdAt: z.iso.datetime(),
});

export type ProjectModelType = z.infer<typeof projectModelSchema>;
