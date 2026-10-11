import { Button } from "@workspace/design-system/components/ui/button";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const segmentedControlVariants = cva("inline-flex rounded-lg border bg-muted p-1", {
  variants: {
    size: {
      default: "h-9.5 gap-0.5",
      sm: "gap-0.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const segmentedControlItemVariants = cva("rounded-md font-medium shadow-none", {
  variants: {
    size: {
      default: "h-7 px-3 text-sm",
      sm: "h-6 px-2.5 text-xs",
    },
    selected: {
      true: "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
      false: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    },
  },
  defaultVariants: {
    size: "default",
    selected: false,
  },
});

export type SegmentedControlItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SegmentedControlProps = {
  value: string;
  onValueChange: (value: string) => void;
  items: SegmentedControlItem[];
  "aria-label": string;
  className?: string;
} & VariantProps<typeof segmentedControlVariants>;

function SegmentedControl({
  value,
  onValueChange,
  items,
  "aria-label": ariaLabel,
  size = "default",
  className,
}: SegmentedControlProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn(segmentedControlVariants({ size }), className)}>
      {items.map((item) => {
        const selected = value === item.value;
        return (
          <Button
            key={item.value}
            type="button"
            variant="ghost"
            size={size === "sm" ? "xs" : "sm"}
            disabled={item.disabled}
            aria-pressed={selected}
            className={segmentedControlItemVariants({ size, selected })}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

export { SegmentedControl, segmentedControlVariants };
