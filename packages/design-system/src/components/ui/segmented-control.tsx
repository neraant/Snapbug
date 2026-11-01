import { Button } from "@workspace/design-system/components/ui/button";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

const segmentedControlVariants = cva("inline-flex rounded-lg border bg-muted p-1", {
  variants: {
    variant: {
      default: "",
      muted: "",
    },
    size: {
      default: "h-9.5 gap-0.5",
      sm: "gap-0.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const segmentedControlItemVariants = cva("rounded-md font-medium shadow-none", {
  variants: {
    size: {
      default: "h-7 px-3 text-sm",
      sm: "h-6 px-2.5 text-xs",
    },
    variant: {
      default: "",
      muted: "",
    },
    selected: {
      true: "",
      false:
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground",
    },
  },
  compoundVariants: [
    {
      variant: "default",
      selected: true,
      class:
        "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground",
    },
    {
      variant: "muted",
      selected: true,
      class:
        "bg-card text-foreground shadow-xs hover:bg-card hover:text-foreground dark:bg-[color-mix(in_oklch,var(--card)_75%,var(--background))] dark:hover:bg-[color-mix(in_oklch,var(--card)_75%,var(--background))]",
    },
  ],
  defaultVariants: {
    size: "default",
    variant: "default",
    selected: false,
  },
});

export type SegmentedControlItem = {
  value: string;
  label: string;
  icon?: ElementType;
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
  variant = "default",
  size = "default",
  className,
}: SegmentedControlProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn(segmentedControlVariants({ variant, size }), className)}>
      {items.map((item) => {
        const selected = value === item.value;
        const Icon = item.icon;
        return (
          <Button
            key={item.value}
            type="button"
            variant={variant === "muted" || !selected ? "ghost" : "default"}
            size={size === "sm" ? "xs" : "sm"}
            disabled={item.disabled}
            aria-pressed={selected}
            className={segmentedControlItemVariants({ size, variant, selected })}
            onClick={() => onValueChange(item.value)}
          >
            {Icon ? <Icon aria-hidden /> : null}
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

export { SegmentedControl, segmentedControlVariants };
