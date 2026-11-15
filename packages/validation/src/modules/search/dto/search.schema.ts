import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { z } from "zod";

export const searchInputDtoSchema = z.object({
  query: z.string().trim().min(1).max(200),
});
export type SearchInputDtoType = z.infer<typeof searchInputDtoSchema>;

const searchProjectResultSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  color: projectColorSchema,
});

const searchTicketResultSchema = z.object({
  id: z.uuid(),
  shortId: z.string(),
  title: z.string(),
  projectId: z.uuid(),
  projectName: z.string(),
});

export const searchOutputDtoSchema = z.object({
  projects: z.array(searchProjectResultSchema),
  tickets: z.array(searchTicketResultSchema),
});
export type SearchOutputDtoType = z.infer<typeof searchOutputDtoSchema>;