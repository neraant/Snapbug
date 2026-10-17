import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import {
  buildSdkSetupInitSnippet,
  buildSdkSetupInitSnippetForCopy,
  type SdkSetupInitTab,
} from "@/client/modules/sdk-setup/utils/build-sdk-setup-snippet.util";
import { useFindProjectApiKey } from "@/client/shared/queries/use-find-project-api-key";
import { useFindProjectWidgetSetting } from "@/client/shared/queries/use-find-project-widget-setting";

const initTabs: SdkSetupInitTab[] = ["react", "next"];

type SdkSetupInitCardProps = {
  projectId: string;
};

export function SdkSetupInitCard({ projectId }: SdkSetupInitCardProps) {
  const { data: apiKeyData } = useFindProjectApiKey({ projectId });
  const { data: widgetSettings } = useFindProjectWidgetSetting({ projectId });
  const [tab, setTab] = useState<SdkSetupInitTab>("react");
  const [revealKey, setRevealKey] = useState(false);

  const items = useMemo(
    () =>
      initTabs.map((value) => ({
        value,
        label: value === "next" ? texts.init.tabs.next : texts.init.tabs.react,
      })),
    [],
  );

  const code = buildSdkSetupInitSnippet({ tab, apiKey: apiKeyData.key, revealKey, widgetSettings });
  const panelTitle = tab === "next" ? texts.init.panelTitle.next : texts.init.panelTitle.react;
  const copyText = buildSdkSetupInitSnippetForCopy({ tab, apiKey: apiKeyData.key, widgetSettings });

  return (
    <MetricCard id="step-init">
      <MetricCard.Header
        title={texts.init.title}
        description={texts.init.description}
        action={
          <Row align="center" gap="sm">
            <Button
              type="button"
              variant="muted"
              size="icon-sm"
              aria-label={revealKey ? texts.init.maskKey : texts.init.revealKey}
              onClick={() => setRevealKey((current) => !current)}
            >
              {revealKey ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
            <SegmentedControl
              size="sm"
              aria-label={texts.init.title}
              value={tab}
              items={items}
              onValueChange={(value) => setTab(value as SdkSetupInitTab)}
            />
          </Row>
        }
      />
      <MetricCard.Content gap="md">
        {/* TODO: Vue 3 and Vanilla JS init tabs */}
        <Code
          title={panelTitle}
          code={code}
          copyText={copyText}
          copyLabel={texts.install.copy}
          copiedLabel={texts.install.copied}
        />
        <Typography variant="text-xs" color="muted">
          {texts.init.tip}
        </Typography>
      </MetricCard.Content>
    </MetricCard>
  );
}

function SdkSetupInitCardFallback() {
  return <Skeleton className="h-64 w-full" />;
}

SdkSetupInitCard.Fallback = SdkSetupInitCardFallback;
