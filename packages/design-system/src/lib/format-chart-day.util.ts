export function formatChartDayLabel(day: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${day}T00:00:00.000Z`),
  );
}
