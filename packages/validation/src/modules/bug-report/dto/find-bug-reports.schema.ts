import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { z } from "zod";

export const findBugReportsInputDtoSchema = z.object({
  // TODO: Add page, limit, filters
  organizationId: z.uuid(),
});

export type FindBugReportsInputDtoType = z.infer<typeof findBugReportsInputDtoSchema>;

export const findBugReportsOutputDtoSchema = bugReportModelSchema.array();

export type FindBugReportsOutputDtoType = z.infer<typeof findBugReportsOutputDtoSchema>;
