import { Row } from "@workspace/design-system/components/layout/row";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const barTrackVariants = cva("overflow-hidden rounded-full bg-muted", {
  variants: {
    size: {
      sm: "h-1.5",
      md: "h-2",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type BarTrackProps = ComponentProps<typeof Row> & VariantProps<typeof barTrackVariants>;

function BarTrack({ size, className, wrap = false, align = "stretch", width = "full", ...props }: BarTrackProps) {
  return (
    <Row
      data-slot="bar-track"
      wrap={wrap}
      align={align}
      width={width}
      className={cn("gap-0", barTrackVariants({ size }), className)}
      {...props}
    />
  );
}

type BarTrackSegmentProps = ComponentProps<typeof Row> & {
  percent: number;
};

function BarTrackSegment({ percent, className, wrap = false, style, ...props }: BarTrackSegmentProps) {
  return (
    <Row
      data-slot="bar-track-segment"
      wrap={wrap}
      className={cn("h-full min-w-0 shrink-0 rounded-full bg-primary", className)}
      style={{ width: `${percent}%`, ...style }}
      {...props}
    />
  );
}

export { BarTrack, BarTrackSegment };
