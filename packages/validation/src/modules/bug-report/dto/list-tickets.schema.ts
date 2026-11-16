import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { z } from "zod";

const listTicketItemSchema = bugReportModelSchema
  .omit({ consoleLogs: true, networkLogs: true })
  .extend({
    hasScreenshot: z.boolean(),
    hasReplay: z.boolean(),
  });

export const listTicketsInputDtoSchema = z.object({
  projectId: z
    .uuid()
    .optional()
    .describe("Limit results to one project the caller can access."),
  status: z
    .enum(BugReportStatus)
    .optional()
    .describe("Filter by ticket status."),
  severity: z
    .enum(BugReportSeverity)
    .optional()
    .describe("Filter by severity."),
  assigneeId: z
    .uuid()
    .optional()
    .describe("Filter by assignee user id."),
  text: z
    .string()
    .trim()
    .optional()
    .describe("Case-insensitive match against title, short id, URL, or description."),
  cursor: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe("Opaque cursor from a previous list_tickets response."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe("Page size; default 20, maximum 50."),
});

export type ListTicketsInputDtoType = z.infer<typeof listTicketsInputDtoSchema>;

export const listTicketsOutputDtoSchema = z.object({
  items: z.array(listTicketItemSchema),
  nextCursor: z.string().nullable(),
});

export type ListTicketsOutputDtoType = z.infer<typeof listTicketsOutputDtoSchema>;