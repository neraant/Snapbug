import type { CSSProperties } from "react";

const chartTooltipTextStyle: CSSProperties = {
  color: "var(--popover-foreground)",
};

export const chartTooltipContentStyle: CSSProperties = {
  ...chartTooltipTextStyle,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--popover)",
  boxShadow: "var(--shadow-md)",
};

export const chartTooltipItemStyle: CSSProperties = chartTooltipTextStyle;

export const chartTooltipLabelStyle: CSSProperties = chartTooltipTextStyle;
