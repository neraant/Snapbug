import { z } from "zod";

export const unreadCountOutputDtoSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type UnreadCountOutputDtoType = z.infer<typeof unreadCountOutputDtoSchema>;