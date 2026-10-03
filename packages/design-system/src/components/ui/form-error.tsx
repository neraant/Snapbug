import { cn } from "@workspace/design-system/lib/utils";
import { CircleAlertIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type FormErrorProps = Omit<ComponentProps<"div">, "children"> & {
  children?: ReactNode;
};

function FormError({ className, children, ...props }: FormErrorProps) {
  if (!children) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="form-error"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive",
        className,
      )}
      {...props}
    >
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export { FormError };
