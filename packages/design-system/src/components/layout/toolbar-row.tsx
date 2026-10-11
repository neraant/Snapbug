import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import type { ReactNode } from "react";

type ToolbarRowProps = {
  leading: ReactNode;
  trailing?: ReactNode;
  trailingAlign?: "start" | "center" | "end";
};

export function ToolbarRow({ leading, trailing, trailingAlign = "center" }: ToolbarRowProps) {
  return (
    <Row gap="md" align="end" justify="between" wrap>
      <Column gap="xs" minWidth="0">
        {leading}
      </Column>
      {trailing ? (
        <Row align={trailingAlign} justify="end" gap="sm" minWidth="0" wrap>
          {trailing}
        </Row>
      ) : null}
    </Row>
  );
}
