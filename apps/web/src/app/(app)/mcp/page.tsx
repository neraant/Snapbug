"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { McpConnectTab } from "@/client/modules/mcp/components/mcp-connect-tab";
import { McpTabShell } from "@/client/modules/mcp/components/mcp-tab-shell";
import { McpToolsTab } from "@/client/modules/mcp/components/mcp-tools-tab";
import { texts } from "@/client/modules/mcp/consts/texts.const";
import { UserTokenList } from "@/client/modules/user-token/components/user-token-list";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description}>
      <McpTabShell
        tools={<McpToolsTab />}
        connect={<McpConnectTab />}
        tokens={
          <Suspense fallback={<UserTokenList.Fallback />}>
            <UserTokenList />
          </Suspense>
        }
      />
    </PageContainer>
  );
}
