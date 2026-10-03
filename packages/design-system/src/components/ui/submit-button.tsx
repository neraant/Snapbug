import { Button } from "@workspace/design-system/components/ui/button";
import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

export function SubmitButton({ loading, disabled, children, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} {...props}>
      {loading && <Loader2Icon className="animate-spin" />}
      {children}
    </Button>
  );
}
