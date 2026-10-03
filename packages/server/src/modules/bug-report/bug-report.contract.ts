import { oc } from "@orpc/contract";
import {
  createBugReportInputDtoSchema,
  createBugReportOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import {
  findBugReportsInputDtoSchema,
  findBugReportsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";

export const bugReportContract = {
  create: oc
    .input(createBugReportInputDtoSchema)
    .output(createBugReportOutputDtoSchema)
    .route({ method: "POST", path: "/bug-reports", tags: ["bug-report"], summary: "Create bug report" }),
  findMany: oc
    .input(findBugReportsInputDtoSchema)
    .output(findBugReportsOutputDtoSchema)
    .route({ method: "GET", path: "/bug-reports", tags: ["bug-report"], summary: "List bug reports" }),
};
