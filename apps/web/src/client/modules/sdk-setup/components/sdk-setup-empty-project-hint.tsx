import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";

export function SdkSetupEmptyProjectHint() {
  // TODO: Rich empty/loading/error states for SDK setup
  return (
    <MetricCard>
      <MetricCard.Content>
        <Typography variant="text-sm" color="muted">
          {texts.selectProject}
        </Typography>
      </MetricCard.Content>
    </MetricCard>
  );
}
