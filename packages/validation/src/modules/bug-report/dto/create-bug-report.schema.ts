import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { z } from "zod";

export const createBugReportInputDtoSchema = bugReportModelSchema
  .pick({ title: true, description: true, url: true })
  .extend({
    apiKey: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.url(),
  });

export type CreateBugReportInputDtoType = z.infer<typeof createBugReportInputDtoSchema>;

export const createBugReportOutputDtoSchema = bugReportModelSchema;

export type CreateBugReportOutputDtoType = z.infer<typeof createBugReportOutputDtoSchema>;
