import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@workspace/design-system/components/ui/tabs";
import type { ReactNode } from "react";

import { mcpTabs } from "@/client/modules/mcp/consts/mcp-tab.const";
import { texts } from "@/client/modules/mcp/consts/texts.const";
import { useMcpTab } from "@/client/modules/mcp/hooks/use-mcp-tab";

type McpTabShellProps = {
  tools: ReactNode;
  connect: ReactNode;
  tokens: ReactNode;
};

export function McpTabShell({ tools, connect, tokens }: McpTabShellProps) {
  const { tab, setTab } = useMcpTab();

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (value === mcpTabs.tools || value === mcpTabs.connect || value === mcpTabs.tokens) {
          setTab(value);
        }
      }}
    >
      <TabsList aria-label={texts.tabs.ariaLabel}>
        <TabsTab value={mcpTabs.tools}>{texts.tabs.tools}</TabsTab>
        <TabsTab value={mcpTabs.connect}>{texts.tabs.connect}</TabsTab>
        <TabsTab value={mcpTabs.tokens}>{texts.tabs.tokens}</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value={mcpTabs.tools} keepMounted>
        {tools}
      </TabsPanel>
      <TabsPanel value={mcpTabs.connect} keepMounted>
        {connect}
      </TabsPanel>
      <TabsPanel value={mcpTabs.tokens} keepMounted>
        {tokens}
      </TabsPanel>
    </Tabs>
  );
}
