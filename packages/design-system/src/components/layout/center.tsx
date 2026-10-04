import { Column } from "@workspace/design-system/components/layout/column";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps, PropsWithChildren } from "react";

type CenterProps = PropsWithChildren<{
  className?: string;
  width?: ComponentProps<typeof Column>["width"];
}>;

export function Center({ children, className, width = "sm" }: CenterProps) {
  return (
    <Column align="center" justify="center" width="full" className={cn("min-h-dvh px-4", className)}>
      <Column width={width} gap="lg">
        {children}
      </Column>
    </Column>
  );
}
