import { z } from "zod";

export const markUnreadInputDtoSchema = z.object({
  ids: z.array(z.uuid()).min(1),
});

export const markUnreadOutputDtoSchema = z.object({
  updated: z.number().int().nonnegative(),
});

export type MarkUnreadInputDtoType = z.infer<typeof markUnreadInputDtoSchema>;
export type MarkUnreadOutputDtoType = z.infer<typeof markUnreadOutputDtoSchema>;