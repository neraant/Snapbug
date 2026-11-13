import { z } from "zod";

export const rotateProjectApiKeyInputDtoSchema = z.object({
  projectId: z.uuid(),
});
export type RotateProjectApiKeyInputDtoType = z.infer<typeof rotateProjectApiKeyInputDtoSchema>;

export const rotateProjectApiKeyOutputDtoSchema = z.object({
  key: z.string(),
  createdAt: z.iso.datetime(),
});
export type RotateProjectApiKeyOutputDtoType = z.infer<typeof rotateProjectApiKeyOutputDtoSchema>;
