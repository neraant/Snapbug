import { z } from "zod";

export const findScreenshotInputDtoSchema = z.object({
  shortId: z.string().min(1),
});

export type FindScreenshotInputDtoType = z.infer<typeof findScreenshotInputDtoSchema>;
