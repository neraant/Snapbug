export type StatTrendPolarity = "higher-is-better" | "lower-is-better";

export type StatTrendTone = "positive" | "negative" | "neutral";

export function resolveStatTrendTone(changePercent: number, polarity: StatTrendPolarity): StatTrendTone {
  if (changePercent === 0) {
    return "neutral";
  }

  const improved = polarity === "higher-is-better" ? changePercent > 0 : changePercent < 0;
  return improved ? "positive" : "negative";
}

export function formatStatTrendPercent(changePercent: number): string {
  const rounded = Math.round(changePercent);
  if (rounded > 0) {
    return `+${rounded}%`;
  }

  return `${rounded}%`;
}
