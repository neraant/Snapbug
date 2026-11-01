const exactTimestampFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatTicketDetailExactTimestamp(isoDate: string): string {
  return exactTimestampFormat.format(new Date(isoDate));
}
