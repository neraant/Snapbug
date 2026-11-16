import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Code } from "@workspace/design-system/components/ui/code";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useEffect, useMemo, useState } from "react";

import { type McpConnectClient, mcpConnectClients } from "@/client/modules/mcp/consts/mcp-tool-filter.const";
import { texts } from "@/client/modules/mcp/consts/texts.const";
import { buildMcpConnectConfig } from "@/client/modules/mcp/utils/build-mcp-connect-config.util";

export function McpConnectTab() {
  const [client, setClient] = useState<McpConnectClient>(mcpConnectClients.cursor);

  const items = useMemo(
    () => [
      { value: mcpConnectClients.cursor, label: texts.connect.clients.cursor },
      { value: mcpConnectClients.claudeDesktop, label: texts.connect.clients.claudeDesktop },
      { value: mcpConnectClients.claudeCode, label: texts.connect.clients.claudeCode },
      { value: mcpConnectClients.other, label: texts.connect.clients.other },
    ],
    [],
  );

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const config = origin ? buildMcpConnectConfig(origin, client) : "";

  return (
    <Column gap="lg" width="full" className="max-w-3xl">
      <SegmentedControl
        aria-label={texts.connect.clientLabel}
        value={client}
        items={items}
        onValueChange={(value) => setClient(value as McpConnectClient)}
      />
      {config ? <Code code={config} copyLabel={texts.connect.copy} copiedLabel={texts.connect.copied} /> : null}
      <Column as="ol" gap="sm" width="full" className="list-decimal pl-5">
        {texts.connect.steps.map((step) => (
          <Typography key={step} as="li" variant="text-sm" color="muted">
            {step}
          </Typography>
        ))}
      </Column>
      <Row gap="xs" width="full">
        <Typography variant="text-xs" color="muted">
          /api/mcp
        </Typography>
      </Row>
    </Column>
  );
}
