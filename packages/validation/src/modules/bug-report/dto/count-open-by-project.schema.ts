import { z } from "zod";

export const countOpenByProjectOutputDtoSchema = z.array(
  z.object({
    projectId: z.uuid(),
    openCount: z.int().min(0),
  }),
);

export type CountOpenByProjectOutputDtoType = z.infer<typeof countOpenByProjectOutputDtoSchema>;
