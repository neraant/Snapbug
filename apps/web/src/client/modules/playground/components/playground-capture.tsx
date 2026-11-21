import type { WidgetPreviewCapture } from "@neraant/snapbug";
import { Column } from "@workspace/design-system/components/layout/column";
import { LogViewer } from "@workspace/design-system/components/ui/log-viewer";
import { Markdown } from "@workspace/design-system/components/ui/markdown";
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@workspace/design-system/components/ui/tabs";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Image from "next/image";
import { useState } from "react";

import { PlaygroundEnvironmentContent } from "@/client/modules/playground/components/playground-environment";
import { PlaygroundReplayPlayer } from "@/client/modules/playground/components/playground-replay";
import {
  type PlaygroundCaptureTab,
  playgroundCaptureTabs,
} from "@/client/modules/playground/consts/playground-capture-tab.const";
import { texts } from "@/client/modules/playground/consts/texts.const";
import {
  formatPlaygroundConsoleLogs,
  formatPlaygroundNetworkLogs,
} from "@/client/modules/playground/utils/format-playground-log.util";

type PlaygroundCaptureProps = {
  capture: WidgetPreviewCapture;
};

export function PlaygroundCapture({ capture }: PlaygroundCaptureProps) {
  const [activeTab, setActiveTab] = useState<PlaygroundCaptureTab>(playgroundCaptureTabs.overview);
  const consoleEntries = formatPlaygroundConsoleLogs(capture.consoleLogs);
  const networkEntries = formatPlaygroundNetworkLogs(capture.networkLogs);
  const description = capture.description.trim();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (
          value === playgroundCaptureTabs.overview ||
          value === playgroundCaptureTabs.screenshot ||
          value === playgroundCaptureTabs.replay ||
          value === playgroundCaptureTabs.console ||
          value === playgroundCaptureTabs.network ||
          value === playgroundCaptureTabs.environment
        ) {
          setActiveTab(value);
        }
      }}
    >
      <TabsList aria-label={texts.result.tabsAriaLabel}>
        <TabsTab value={playgroundCaptureTabs.overview}>{texts.result.overview}</TabsTab>
        <TabsTab value={playgroundCaptureTabs.screenshot}>{texts.result.screenshot}</TabsTab>
        <TabsTab value={playgroundCaptureTabs.replay}>{texts.result.replay}</TabsTab>
        <TabsTab value={playgroundCaptureTabs.console}>{texts.result.console}</TabsTab>
        <TabsTab value={playgroundCaptureTabs.network}>{texts.result.network}</TabsTab>
        <TabsTab value={playgroundCaptureTabs.environment}>{texts.result.environment}</TabsTab>
        <TabsIndicator />
      </TabsList>

      <TabsPanel value={playgroundCaptureTabs.overview} keepMounted>
        <Column gap="md" width="full" minWidth="0" className="pt-4">
          <Typography variant="heading-sm" font="heading" weight="semibold" as="h3">
            {capture.title}
          </Typography>
          {description ? (
            <Markdown source={description} />
          ) : (
            <Typography variant="text-sm" color="muted">
              {texts.capture.emptyDescription}
            </Typography>
          )}
        </Column>
      </TabsPanel>

      <TabsPanel value={playgroundCaptureTabs.screenshot} keepMounted>
        <Column gap="md" width="full" minWidth="0" className="pt-4">
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
        </Column>
      </TabsPanel>

      <TabsPanel value={playgroundCaptureTabs.replay} keepMounted>
        <Column gap="md" width="full" minWidth="0" className="pt-4">
          {capture.replayEvents.length > 0 ? (
            <PlaygroundReplayPlayer events={capture.replayEvents} />
          ) : (
            <Typography variant="text-sm" color="muted">
              {texts.capture.replayEmpty}
            </Typography>
          )}
        </Column>
      </TabsPanel>

      <TabsPanel value={playgroundCaptureTabs.console} keepMounted>
        <Column gap="md" width="full" minWidth="0" className="pt-4">
          <LogViewer entries={consoleEntries} emptyLabel={texts.capture.emptyConsole} />
        </Column>
      </TabsPanel>

      <TabsPanel value={playgroundCaptureTabs.network} keepMounted>
        <Column gap="md" width="full" minWidth="0" className="pt-4">
          <LogViewer entries={networkEntries} emptyLabel={texts.capture.emptyNetwork} />
        </Column>
      </TabsPanel>

      <TabsPanel value={playgroundCaptureTabs.environment} keepMounted>
        <Column gap="md" width="full" minWidth="0" className="pt-4">
          <PlaygroundEnvironmentContent capture={capture} />
        </Column>
      </TabsPanel>
    </Tabs>
  );
}
