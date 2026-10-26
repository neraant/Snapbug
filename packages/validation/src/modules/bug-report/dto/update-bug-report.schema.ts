import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import type { z } from "zod";

const updateBugReportMutableFieldSchema = bugReportModelSchema.pick({
  assignedTo: true,
  status: true,
  boardOrder: true,
  severity: true,
  title: true,
  description: true,
  stepsToReproduce: true,
  reporterEmail: true,
  url: true,
  userAgent: true,
  browser: true,
  os: true,
  device: true,
  viewportWidth: true,
  viewportHeight: true,
  consoleLogs: true,
  networkLogs: true,
  customContext: true,
});

export const updateBugReportInputDtoSchema = updateBugReportMutableFieldSchema
  .partial()
  .extend({ id: bugReportModelSchema.shape.id })
  .refine(
    (data) =>
      data.assignedTo !== undefined ||
      data.status !== undefined ||
      data.boardOrder !== undefined ||
      data.severity !== undefined ||
      data.title !== undefined ||
      data.description !== undefined ||
      data.stepsToReproduce !== undefined ||
      data.reporterEmail !== undefined ||
      data.url !== undefined ||
      data.userAgent !== undefined ||
      data.browser !== undefined ||
      data.os !== undefined ||
      data.device !== undefined ||
      data.viewportWidth !== undefined ||
      data.viewportHeight !== undefined ||
      data.consoleLogs !== undefined ||
      data.networkLogs !== undefined ||
      data.customContext !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export type UpdateBugReportInputDtoType = z.infer<typeof updateBugReportInputDtoSchema>;

export const updateBugReportOutputDtoSchema = bugReportModelSchema;

export type UpdateBugReportOutputDtoType = z.infer<typeof updateBugReportOutputDtoSchema>;
