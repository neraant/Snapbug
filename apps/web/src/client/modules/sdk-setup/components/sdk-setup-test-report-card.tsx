import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";

export function SdkSetupTestReportCard() {
  return (
    <MetricCard id="step-test-report">
      <MetricCard.Header title={texts.testReport.title} description={texts.testReport.description} />
      <MetricCard.Content gap="md">
        {/* TODO: Wire test-report action when simulate-report API is available. */}
        <Typography variant="text-xs" color="muted">
          {texts.testReport.status}
        </Typography>
      </MetricCard.Content>
    </MetricCard>
  );
}

function SdkSetupTestReportCardFallback() {
  return <Skeleton className="h-32 w-full" />;
}

SdkSetupTestReportCard.Fallback = SdkSetupTestReportCardFallback;
