import type { WidgetPreviewCapture } from "@neraant/snapbug";
import { Column } from "@workspace/design-system/components/layout/column";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { WidgetUserAgentService } from "@workspace/server/modules/bug-report/service/widget-user-agent.service";

import { PlaygroundEnvironmentPropertyRow } from "@/client/modules/playground/components/playground-environment-property-row";
import { texts } from "@/client/modules/playground/consts/texts.const";

const userAgentService = new WidgetUserAgentService();

type PlaygroundEnvironmentProps = {
  capture: WidgetPreviewCapture;
};

export function PlaygroundEnvironment({ capture }: PlaygroundEnvironmentProps) {
  const parsed = userAgentService.parse(capture.userAgent);
  const viewport =
    capture.viewportWidth != null && capture.viewportHeight != null
      ? `${capture.viewportWidth} × ${capture.viewportHeight}`
      : null;

  return (
    <Column gap="lg" width="full" minWidth="0" className="w-full shrink-0 lg:max-w-sm">
      <Panel width="full" minWidth="0">
        <Panel.Header title={texts.capture.environmentTitle} />
        <Panel.Content>
          <Column gap="sm" width="full">
            {parsed.browser ? (
              <PlaygroundEnvironmentPropertyRow label={texts.capture.browser} value={parsed.browser} />
            ) : null}
            {parsed.os ? <PlaygroundEnvironmentPropertyRow label={texts.capture.os} value={parsed.os} /> : null}
            {parsed.device ? <PlaygroundEnvironmentPropertyRow label={texts.capture.device} value={parsed.device} /> : null}
            {viewport ? <PlaygroundEnvironmentPropertyRow label={texts.capture.viewport} value={viewport} /> : null}
            {capture.url ? <PlaygroundEnvironmentPropertyRow label={texts.capture.pageUrl} value={capture.url} /> : null}
          </Column>
        </Panel.Content>
      </Panel>
    </Column>
  );
}