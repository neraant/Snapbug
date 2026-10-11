import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import type { z } from "zod";

export const findBugReportsOutputDtoSchema = bugReportModelSchema.array();

export type FindBugReportsOutputDtoType = z.infer<typeof findBugReportsOutputDtoSchema>;
