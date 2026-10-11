export const reportsOverTimeSeriesId = {
  ALL: "all",
  CREATED: "created",
  RESOLVED: "resolved",
} as const;

export type ReportsOverTimeSeriesIdType = (typeof reportsOverTimeSeriesId)[keyof typeof reportsOverTimeSeriesId];

export const reportsOverTimeSeriesColor = {
  created: "var(--color-chart-1)",
  resolved: "var(--color-chart-2)",
} as const;
