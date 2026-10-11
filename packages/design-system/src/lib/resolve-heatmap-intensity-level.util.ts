export type HeatmapIntensityLevel = 0 | 1 | 2 | 3;

export function resolveHeatmapIntensityLevel(count: number, maxCount: number): HeatmapIntensityLevel {
  if (count <= 0 || maxCount <= 0) return 0;
  const scaled = Math.ceil((count / maxCount) * 3);
  return Math.min(3, scaled) as 1 | 2 | 3;
}

export const heatmapIntensityCellClassName: Record<HeatmapIntensityLevel, string> = {
  0: "bg-muted border-border",
  1: "bg-orange-200 border-orange-300",
  2: "bg-orange-400 border-orange-500",
  3: "bg-orange-600 border-orange-700",
};
