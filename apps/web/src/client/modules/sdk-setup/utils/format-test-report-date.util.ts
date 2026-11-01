const testReportDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatTestReportDate(createdAt: string): string {
  return testReportDateFormat.format(new Date(createdAt));
}
