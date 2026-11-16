import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { z } from "zod";

export const updateTicketMcpInputDtoSchema = z
  .object({
    id: bugReportModelSchema.shape.id.describe("Ticket uuid from get_ticket."),
    status: bugReportModelSchema.shape.status.optional().describe("New workflow status."),
    severity: bugReportModelSchema.shape.severity.optional().describe("New severity."),
    assignedTo: bugReportModelSchema.shape.assignedTo.optional().describe("Assignee user id from list_members."),
  })
  .refine((data) => data.status !== undefined || data.severity !== undefined || data.assignedTo !== undefined, {
    message: "Provide at least one of status, severity, or assignedTo.",
  });

export type UpdateTicketMcpInputDtoType = z.infer<typeof updateTicketMcpInputDtoSchema>;
