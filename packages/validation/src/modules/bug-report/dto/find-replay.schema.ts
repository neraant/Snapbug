import { z } from "zod";

export const findReplayInputDtoSchema = z.object({
  shortId: z.string().min(1),
});

export type FindReplayInputDtoType = z.infer<typeof findReplayInputDtoSchema>;
