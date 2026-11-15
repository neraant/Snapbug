import type { WidgetPreviewCapture } from "@neraant/snapbug";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { WidgetUserAgentService } from "@workspace/server/modules/bug-report/service/widget-user-agent.service";
import { MonitorIcon } from "lucide-react";
import type { ReactNode } from "react";

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
    <Panel width="full" minWidth="0">
      <Panel.Header title={texts.capture.environmentTitle} icon={MonitorIcon} />
      <Panel.Content>
        <Column gap="sm" width="full">
          {parsed.browser ? <PropertyRow label={texts.capture.browser} value={parsed.browser} /> : null}
          {parsed.os ? <PropertyRow label={texts.capture.os} value={parsed.os} /> : null}
          {parsed.device ? <PropertyRow label={texts.capture.device} value={parsed.device} /> : null}
          {viewport ? <PropertyRow label={texts.capture.viewport} value={viewport} /> : null}
          {capture.url ? <PropertyRow label={texts.capture.pageUrl} value={capture.url} /> : null}
        </Column>
      </Panel.Content>
    </Panel>
  );
}

type PropertyRowProps = {
  label: string;
  value: ReactNode;
};

function PropertyRow({ label, value }: PropertyRowProps) {
  return (
    <Row align="start" justify="between" gap="md" wrap={false} width="full">
      <Typography variant="text-xs" color="muted" className="shrink-0">
        {label}
      </Typography>
      <Typography variant="text-xs" align="right" className="min-w-0">
        {value}
      </Typography>
    </Row>
  );
}
