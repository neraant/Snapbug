import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@workspace/design-system/lib/utils";

type ProgressProps = ProgressPrimitive.Root.Props & {
  label?: string;
};

function Progress({ className, value, label, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("flex w-full flex-col gap-2", className)}
      value={value}
      {...props}
    >
      {label ? <ProgressPrimitive.Label className="sr-only">{label}</ProgressPrimitive.Label> : null}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full w-full origin-left bg-primary transition-all"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
