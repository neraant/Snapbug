const activityDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatActivityDate(createdAt: string): string {
  return activityDateFormat.format(new Date(createdAt));
}
