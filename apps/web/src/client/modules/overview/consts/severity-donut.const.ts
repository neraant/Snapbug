export const severityDonutLegendOrder = ["critical", "high", "low", "medium"] as const;

export type SeverityDonutKeyType = (typeof severityDonutLegendOrder)[number];

export const severityDonutColor: Record<SeverityDonutKeyType, string> = {
  critical: "var(--color-chart-5)",
  high: "var(--color-chart-1)",
  medium: "var(--color-chart-4)",
  low: "var(--color-muted-foreground)",
};
