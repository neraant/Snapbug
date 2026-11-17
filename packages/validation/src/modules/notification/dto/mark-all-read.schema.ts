import { z } from "zod";

export const markAllReadOutputDtoSchema = z.object({
  updated: z.number().int().nonnegative(),
});

export type MarkAllReadOutputDtoType = z.infer<typeof markAllReadOutputDtoSchema>;