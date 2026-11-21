import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";

export type BugReportSearchRowType = Pick<
  BugReportModelType,
  "id" | "shortId" | "title" | "projectId" | "status" | "severity"
>;

export type BugReportPort = {
  findManyForSearch: (projectIds: string[], query: string, limit: number) => Promise<BugReportSearchRowType[]>;
};
