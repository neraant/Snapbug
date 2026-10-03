import { z } from "zod";

export const projectModelSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  organizationId: z.uuid(),
  createdAt: z.iso.datetime(),
});

export type ProjectModelType = z.infer<typeof projectModelSchema>;
