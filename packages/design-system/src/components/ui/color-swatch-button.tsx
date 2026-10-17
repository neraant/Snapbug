import { Button } from "@workspace/design-system/components/ui/button";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps } from "react";

type ColorSwatchButtonProps = Omit<ComponentProps<typeof Button>, "children"> & {
  color: string;
  selected?: boolean;
  label: string;
};

function ColorSwatchButton({ color, selected, label, className, size = "icon-sm", ...props }: ColorSwatchButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      aria-label={label}
      aria-pressed={selected}
      className={cn(selected && "ring-3 ring-ring/50", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-4 rounded-full border border-border"
        style={{ backgroundColor: color }}
      />
    </Button>
  );
}

export { ColorSwatchButton };
