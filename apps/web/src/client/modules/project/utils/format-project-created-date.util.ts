const projectCreatedDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatProjectCreatedDate(createdAt: string): string {
  return projectCreatedDateFormat.format(new Date(createdAt));
}
