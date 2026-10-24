import { Row } from "@workspace/design-system/components/layout/row";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import type { SdkSetupTestReportConnectionState } from "@/client/modules/sdk-setup/hooks/use-sdk-setup-test-report";

type SdkSetupTestReportStatusRowProps = {
  state: SdkSetupTestReportConnectionState;
};

const statusLabel: Record<SdkSetupTestReportConnectionState, string> = {
  connected: texts.testReport.connection.connected,
  listening: texts.testReport.connection.waiting,
  "not-connected": texts.testReport.connection.notConnected,
};

const statusDotClassName = "size-2 shrink-0 rounded-full animate-pulse";

function SdkSetupTestReportStatusDot({ state }: { state: SdkSetupTestReportConnectionState }) {
  if (state === "listening") {
    return (
      <span className={cn(statusDotClassName, "animate-pulse bg-success motion-reduce:animate-none")} aria-hidden />
    );
  }

  if (state === "connected") {
    return <span className={cn(statusDotClassName, "bg-success")} aria-hidden />;
  }

  return <span className={cn(statusDotClassName, "bg-muted-foreground/35")} aria-hidden />;
}

export function SdkSetupTestReportStatusRow({ state }: SdkSetupTestReportStatusRowProps) {
  const label = statusLabel[state];

  return (
    <Row align="center" gap="sm" role="status">
      <SdkSetupTestReportStatusDot state={state} />
      <Typography variant="text-xs" color="muted">
        {label}
      </Typography>
    </Row>
  );
}
