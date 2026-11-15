import type { WidgetPreviewCapture } from "@neraant/snapbug";
import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { LogViewer } from "@workspace/design-system/components/ui/log-viewer";
import { Markdown } from "@workspace/design-system/components/ui/markdown";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { ActivityIcon, CameraIcon, CirclePlayIcon, FileTextIcon, GlobeIcon,TerminalIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { PlaygroundEnvironment } from "@/client/modules/playground/components/playground-environment";
import { PlaygroundReplayPlayer } from "@/client/modules/playground/components/playground-replay";
import { texts } from "@/client/modules/playground/consts/texts.const";
import {
  formatPlaygroundConsoleLogs,
  formatPlaygroundNetworkLogs,
} from "@/client/modules/playground/utils/format-playground-log.util";

type PlaygroundCaptureProps = {
  capture: WidgetPreviewCapture;
};

type DiagnosticsTab = "console" | "network";

export function PlaygroundCapture({ capture }: PlaygroundCaptureProps) {
  const [activeTab, setActiveTab] = useState<DiagnosticsTab>("console");
  const consoleEntries = formatPlaygroundConsoleLogs(capture.consoleLogs);
  const networkEntries = formatPlaygroundNetworkLogs(capture.networkLogs);
  const entries = activeTab === "console" ? consoleEntries : networkEntries;
  const emptyLabel = activeTab === "console" ? texts.capture.emptyConsole : texts.capture.emptyNetwork;
  const description = capture.description.trim();

  return (
    <Column gap="none" width="full" minWidth="0">
      <Column gap="md" padding="lg" width="full" minWidth="0">
        <Typography variant="heading-md" font="heading" weight="semibold" as="h2">
          {capture.title}
        </Typography>
      </Column>
      <Separator />
      <Column gap="lg" padding="lg" minWidth="0" width="full">
        <Grid columns="responsive-3" gap="lg">
          <Column gap="lg" minWidth="0" width="full" className="min-w-0 lg:col-span-2">
            <Panel width="full" minWidth="0">
              <Panel.Header title={texts.capture.descriptionTitle} icon={FileTextIcon} />
              <Panel.Content>
                {description ? (
                  <Markdown source={description} />
                ) : (
                  <Typography variant="text-sm" color="muted">
                    {texts.capture.emptyDescription}
                  </Typography>
                )}
              </Panel.Content>
            </Panel>
            <Panel width="full" minWidth="0">
              <Panel.Header title={texts.capture.screenshotTitle} icon={CameraIcon} />
              <Panel.Content>
                {capture.screenshotUrl ? (
                  <Image
                    src={capture.screenshotUrl}
                    alt={texts.capture.screenshotAlt}
                    unoptimized
                    width={1}
                    height={1}
                    className="h-auto w-auto max-w-full rounded-md border border-border"
                  />
                ) : (
                  <Typography variant="text-sm" color="muted">
                    {texts.capture.screenshotEmpty}
                  </Typography>
                )}
              </Panel.Content>
            </Panel>
            <Panel width="full" minWidth="0">
              <Panel.Header title={texts.capture.replayTitle} icon={CirclePlayIcon} />
              <Panel.Content>
                {capture.replayEvents.length > 0 ? (
                  <PlaygroundReplayPlayer events={capture.replayEvents} />
                ) : (
                  <Typography variant="text-sm" color="muted">
                    {texts.capture.replayEmpty}
                  </Typography>
                )}
              </Panel.Content>
            </Panel>
            <Panel width="full" minWidth="0">
              <Panel.Header
                title={texts.capture.diagnosticsTitle}
                icon={ActivityIcon}
                action={
                  <SegmentedControl
                    aria-label={texts.capture.diagnosticsAria}
                    variant="muted"
                    size="sm"
                    value={activeTab}
                    items={[
                      { value: "console", label: texts.capture.console, icon: TerminalIcon },
                      { value: "network", label: texts.capture.network, icon: GlobeIcon },
                    ]}
                    onValueChange={(value) => setActiveTab(value as DiagnosticsTab)}
                  />
                }
              />
              <Panel.Content>
                <LogViewer entries={entries} emptyLabel={emptyLabel} />
              </Panel.Content>
            </Panel>
          </Column>
          <PlaygroundEnvironment capture={capture} />
        </Grid>
      </Column>
    </Column>
  );
}