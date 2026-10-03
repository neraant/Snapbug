import { Column } from "@workspace/design-system/components/layout/column";
import type { ComponentProps, PropsWithChildren } from "react";

type CenterProps = PropsWithChildren<{
  width?: ComponentProps<typeof Column>["width"];
}>;

export function Center({ children, width = "sm" }: CenterProps) {
  return (
    <Column align="center" justify="center" width="full" className="min-h-dvh px-4">
      <Column width={width} gap="lg">
        {children}
      </Column>
    </Column>
  );
}
