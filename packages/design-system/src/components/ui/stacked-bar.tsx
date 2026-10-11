import { BarTrack, BarTrackSegment } from "@workspace/design-system/components/ui/bar-track";
import { cn } from "@workspace/design-system/lib/utils";

export type StackedBarSegment = {
  key: string;
  value: number;
  color: string;
};

type StackedBarProps = {
  segments: StackedBarSegment[];
  className?: string;
};

function StackedBar({ segments, className }: StackedBarProps) {
  const visibleSegments = segments.filter((segment) => segment.value > 0);
  const total = visibleSegments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <BarTrack data-slot="stacked-bar" size="md" role="img" aria-hidden={total === 0} className={cn(className)}>
      {total > 0
        ? visibleSegments.map((segment) => (
            <BarTrackSegment
              key={segment.key}
              percent={(segment.value / total) * 100}
              className="rounded-none first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: segment.color }}
            />
          ))
        : null}
    </BarTrack>
  );
}

export { StackedBar };
