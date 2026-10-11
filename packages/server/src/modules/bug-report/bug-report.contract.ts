import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  createBugReportInputDtoSchema,
  createBugReportOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import {
  findBugReportsInputDtoSchema,
  findBugReportsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";
import {
  findChartsInputDtoSchema,
  findChartsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-charts.schema";
import {
  findStatsInputDtoSchema,
  findStatsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-stats.schema";

const bugReport = oc.$meta<{ mcp?: boolean }>({});

export const bugReportContract = {
  create: bugReport
    .meta({ mcp: true })
    .input(createBugReportInputDtoSchema)
    .output(createBugReportOutputDtoSchema)
    .route({ method: "POST", path: "/bug-reports", tags: ["bug-report"], summary: "Create bug report" }),
  findMany: bugReport
    .input(findBugReportsInputDtoSchema)
    .output(findBugReportsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/bug-reports",
      tags: ["bug-report"],
      summary: "List bug reports",
      spec: sessionAuthSpec,
    }),
  findStats: bugReport
    .input(findStatsInputDtoSchema)
    .output(findStatsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/bug-reports/stats",
      tags: ["bug-report"],
      summary: "Bug report overview stats",
      spec: sessionAuthSpec,
    }),
  findCharts: bugReport
    .input(findChartsInputDtoSchema)
    .output(findChartsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/bug-reports/charts",
      tags: ["bug-report"],
      summary: "Bug report overview charts",
      spec: sessionAuthSpec,
    }),
};
