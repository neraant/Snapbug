import { Code } from "@workspace/design-system/components/ui/code";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { useMemo, useState } from "react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import {
  buildSdkSetupInstallSnippet,
  type SdkSetupInstallTab,
} from "@/client/modules/sdk-setup/utils/build-sdk-setup-snippet.util";
import { useFindProjectApiKey } from "@/client/modules/shared/queries/use-find-project-api-key";

const installTabs: SdkSetupInstallTab[] = ["npm", "pnpm", "yarn", "script"];

type SdkSetupInstallCardProps = {
  projectId: string;
};

export function SdkSetupInstallCard({ projectId }: SdkSetupInstallCardProps) {
  const { data } = useFindProjectApiKey({ projectId });
  const [tab, setTab] = useState<SdkSetupInstallTab>("npm");

  const items = useMemo(
    () =>
      installTabs.map((value) => ({
        value,
        label: value === "script" ? texts.install.tabs.script : texts.install.tabs[value],
      })),
    [],
  );

  const code = buildSdkSetupInstallSnippet(tab, data.key);
  const panelTitle = tab === "script" ? texts.install.panelTitle.script : texts.install.panelTitle.terminal;

  return (
    <Panel id="step-install">
      <Panel.Header
        title={texts.install.title}
        description={texts.install.description}
        action={
          <SegmentedControl
            size="sm"
            aria-label={texts.install.title}
            value={tab}
            items={items}
            onValueChange={(value) => setTab(value as SdkSetupInstallTab)}
          />
        }
      />
      <Panel.Content gap="md">
        <Code title={panelTitle} code={code} copyLabel={texts.install.copy} copiedLabel={texts.install.copied} />
      </Panel.Content>
    </Panel>
  );
}

function SdkSetupInstallCardFallback() {
  return <Skeleton className="h-55" />;
}

SdkSetupInstallCard.Fallback = SdkSetupInstallCardFallback;
