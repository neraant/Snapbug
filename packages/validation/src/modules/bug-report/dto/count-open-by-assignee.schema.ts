import { z } from "zod";

export const countOpenByAssigneeOutputDtoSchema = z.array(
  z.object({
    userId: z.uuid(),
    openCount: z.int().min(0),
  }),
);

export type CountOpenByAssigneeOutputDtoType = z.infer<typeof countOpenByAssigneeOutputDtoSchema>;
