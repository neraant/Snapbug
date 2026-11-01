import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const statusIndicatorVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    status: {
      new: "bg-info",
      in_progress: "bg-warning",
      resolved: "bg-success",
      closed: "bg-muted-foreground",
    },
  },
  defaultVariants: {
    status: "new",
  },
});

type StatusIndicatorProps = ComponentProps<"span"> & VariantProps<typeof statusIndicatorVariants>;

function StatusIndicator({ className, status = "new", ...props }: StatusIndicatorProps) {
  return (
    <span data-slot="status-indicator" className={cn(statusIndicatorVariants({ status }), className)} {...props} />
  );
}

export { StatusIndicator, statusIndicatorVariants };
