import { z } from "zod";

export const findProjectApiKeyInputDtoSchema = z.object({
  projectId: z.uuid(),
});
export type FindProjectApiKeyInputDtoType = z.infer<typeof findProjectApiKeyInputDtoSchema>;

export const findProjectApiKeyOutputDtoSchema = z.object({
  key: z.string(),
  createdAt: z.iso.datetime(),
  revealed: z.boolean(),
});
export type FindProjectApiKeyOutputDtoType = z.infer<typeof findProjectApiKeyOutputDtoSchema>;
