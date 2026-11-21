import { z } from "zod";

export const markReadInputDtoSchema = z.object({
  ids: z.array(z.uuid()).min(1),
});

export const markReadOutputDtoSchema = z.object({
  updated: z.number().int().nonnegative(),
});

export type MarkReadInputDtoType = z.infer<typeof markReadInputDtoSchema>;
export type MarkReadOutputDtoType = z.infer<typeof markReadOutputDtoSchema>;
