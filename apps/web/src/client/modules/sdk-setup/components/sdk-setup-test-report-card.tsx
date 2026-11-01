import { Panel } from "@workspace/design-system/components/ui/panel";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { SdkSetupTestReportStatusRow } from "@/client/modules/sdk-setup/components/sdk-setup-test-report-status-row";
import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useSdkSetupTestReport } from "@/client/modules/sdk-setup/hooks/use-sdk-setup-test-report";

type SdkSetupTestReportCardProps = {
  projectId: string;
};

export function SdkSetupTestReportCard({ projectId }: SdkSetupTestReportCardProps) {
  const { connectionState } = useSdkSetupTestReport(projectId);

  return (
    <Panel id="step-test-report">
      <Panel.Header title={texts.testReport.title} description={texts.testReport.description} />
      <Panel.Content gap="md">
        <SdkSetupTestReportStatusRow state={connectionState} />
      </Panel.Content>
    </Panel>
  );
}

function SdkSetupTestReportCardFallback() {
  return <Skeleton className="h-32 w-full" />;
}

SdkSetupTestReportCard.Fallback = SdkSetupTestReportCardFallback;
