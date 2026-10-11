import { cn } from "@workspace/design-system/lib/utils";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export type SparklinePoint = {
  value: number;
};

type SparklineChartProps = {
  data: SparklinePoint[];
  stroke?: string;
  className?: string;
};

function SparklineChart({ data, stroke = "var(--color-chart-1)", className }: SparklineChartProps) {
  return (
    <div className={cn("h-7 w-16 shrink-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <Line type="monotone" dataKey="value" dot={false} strokeWidth={2} stroke={stroke} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { SparklineChart };
