import { z } from "zod";

export const countOpenByProjectOutputDtoSchema = z.array(
  z.object({
    projectId: z.uuid(),
    openCount: z.int().min(0),
    totalCount: z.int().min(0),
    lastTicketAt: z.iso.datetime().nullable(),
  }),
);

export type CountOpenByProjectOutputDtoType = z.infer<typeof countOpenByProjectOutputDtoSchema>;
