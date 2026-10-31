import { Panel } from "@workspace/design-system/components/ui/panel";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";

export function SdkSetupEmptyProjectHint() {
  // TODO: Rich empty/loading/error states for SDK setup
  return (
    <Panel>
      <Panel.Content>
        <Typography variant="text-sm" color="muted">
          {texts.selectProject}
        </Typography>
      </Panel.Content>
    </Panel>
  );
}
