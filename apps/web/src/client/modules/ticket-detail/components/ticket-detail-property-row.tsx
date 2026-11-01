import { Row } from "@workspace/design-system/components/layout/row";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { ReactNode } from "react";

type TicketDetailPropertyRowProps = {
  label: string;
  value: ReactNode;
};

function isPlainTextValue(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

export function TicketDetailPropertyRow({ label, value }: TicketDetailPropertyRowProps) {
  return (
    <Row align="start" justify="between" gap="md" wrap={false} width="full">
      <Typography variant="text-xs" color="muted" className="shrink-0">
        {label}
      </Typography>
      {isPlainTextValue(value) ? (
        <Typography variant="text-xs" align="right" className="min-w-0">
          {value}
        </Typography>
      ) : (
        <Row align="center" justify="end" gap="xs" wrap={false} minWidth="0" className="min-w-0">
          {value}
        </Row>
      )}
    </Row>
  );
}
