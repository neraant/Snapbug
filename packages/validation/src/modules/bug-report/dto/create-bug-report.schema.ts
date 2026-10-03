import { z } from "zod";

export const createBugReportInputDtoSchema = z.object({
  apiKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.url(),
});

export type CreateBugReportInputDtoType = z.infer<typeof createBugReportInputDtoSchema>;
