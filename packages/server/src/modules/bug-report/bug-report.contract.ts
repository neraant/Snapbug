import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  createBugReportInputDtoSchema,
  createBugReportOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import {
  findBreakdownsInputDtoSchema,
  findBreakdownsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";
import { findBugReportsOutputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";
import {
  findChartsInputDtoSchema,
  findChartsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-charts.schema";
import {
  findRecentInputDtoSchema,
  findRecentOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-recent.schema";
import {
  findStatsInputDtoSchema,
  findStatsOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import {
  findWorkloadInputDtoSchema,
  findWorkloadOutputDtoSchema,
} from "@workspace/validation/modules/bug-report/dto/find-workload.schema";

const bugReport = oc.$meta<{ mcp?: boolean }>({});

export const bugReportContract = {
  create: bugReport
    .meta({ mcp: true })
    .input(createBugReportInputDtoSchema)
    .output(createBugReportOutputDtoSchema)
    .route({ method: "POST", path: "/bug-reports", tags: ["bug-report"], summary: "Create bug report" }),
  findMany: bugReport.output(findBugReportsOutputDtoSchema).route({
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
  findBreakdowns: bugReport
    .input(findBreakdownsInputDtoSchema)
    .output(findBreakdownsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/bug-reports/breakdowns",
      tags: ["bug-report"],
      summary: "Bug report overview breakdowns",
      spec: sessionAuthSpec,
    }),
  findRecent: bugReport
    .input(findRecentInputDtoSchema)
    .output(findRecentOutputDtoSchema)
    .route({
      method: "GET",
      path: "/bug-reports/recent",
      tags: ["bug-report"],
      summary: "Recent bug reports",
      spec: sessionAuthSpec,
    }),
  findWorkload: bugReport
    .input(findWorkloadInputDtoSchema)
    .output(findWorkloadOutputDtoSchema)
    .route({
      method: "GET",
      path: "/bug-reports/workload",
      tags: ["bug-report"],
      summary: "Bug report team workload",
      spec: sessionAuthSpec,
    }),
};
