import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Suspense } from "react";

import { SdkSetupApiKeyCard } from "@/client/modules/sdk-setup/components/sdk-setup-api-key-card";
import { SdkSetupInitCard } from "@/client/modules/sdk-setup/components/sdk-setup-init-card";
import { SdkSetupInstallCard } from "@/client/modules/sdk-setup/components/sdk-setup-install-card";
import { SdkSetupTestReportCard } from "@/client/modules/sdk-setup/components/sdk-setup-test-report-card";
import { SdkSetupWidgetSettingsCard } from "@/client/modules/sdk-setup/components/sdk-setup-widget-settings-card";

type SdkSetupProjectContentProps = {
  projectId: string;
};

export function SdkSetupProjectContent({ projectId }: SdkSetupProjectContentProps) {
  return (
    <Grid columns="responsive-2" gap="xl">
      <Column gap="lg" minWidth="0">
        {/* TODO: Setup checklist and live preview */}
        <Suspense fallback={<SdkSetupInstallCard.Fallback />}>
          <SdkSetupInstallCard projectId={projectId} />
        </Suspense>
        <Suspense fallback={<SdkSetupInitCard.Fallback />}>
          <SdkSetupInitCard projectId={projectId} />
        </Suspense>
        <Suspense fallback={<SdkSetupTestReportCard.Fallback />}>
          <SdkSetupTestReportCard />
        </Suspense>
      </Column>
      <Column gap="lg" minWidth="0" width="full">
        <Suspense fallback={<SdkSetupApiKeyCard.Fallback />}>
          <SdkSetupApiKeyCard projectId={projectId} />
        </Suspense>
        <Suspense fallback={<SdkSetupWidgetSettingsCard.Fallback />}>
          <SdkSetupWidgetSettingsCard projectId={projectId} />
        </Suspense>
      </Column>
    </Grid>
  );
}
