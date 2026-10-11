export const environmentBreakdownDimensions = ["browser", "os", "device"] as const;

export type EnvironmentBreakdownDimensionType = (typeof environmentBreakdownDimensions)[number];
