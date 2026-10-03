import { Column } from "@workspace/design-system/components/layout/column";
import type { PropsWithChildren } from "react";

type CenterProps = PropsWithChildren;

export function Center({ children }: CenterProps) {
  return (
    <Column align="center" justify="center" className="min-h-dvh">
      {children}
    </Column>
  );
}
