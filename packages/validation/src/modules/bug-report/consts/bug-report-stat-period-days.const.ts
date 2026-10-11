export const bugReportStatPeriodDays = [7, 30, 90] as const;

export type BugReportStatPeriodDaysType = (typeof bugReportStatPeriodDays)[number];
