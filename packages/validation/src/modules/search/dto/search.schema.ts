import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { projectSlugSchema } from "@workspace/validation/shared/project-slug.schema";
import { z } from "zod";

export const searchInputDtoSchema = z.object({
  query: z.string().trim().min(1).max(200).describe("Keywords to match project names or ticket fields."),
  organizationId: z
    .uuid()
    .optional()
    .describe("Organization to search; defaults to the caller's primary organization when omitted."),
});
export type SearchInputDtoType = z.infer<typeof searchInputDtoSchema>;

const searchProjectResultSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: projectSlugSchema,
  color: projectColorSchema,
});

const searchTicketResultSchema = z.object({
  id: z.uuid(),
  shortId: z.string(),
  title: z.string(),
  projectId: z.uuid(),
  projectName: z.string(),
  status: z.enum(BugReportStatus),
  severity: z.enum(BugReportSeverity),
});

export const searchOutputDtoSchema = z.object({
  projects: z.array(searchProjectResultSchema),
  tickets: z.array(searchTicketResultSchema),
});
export type SearchOutputDtoType = z.infer<typeof searchOutputDtoSchema>;