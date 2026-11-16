import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Card } from "@workspace/design-system/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { McpToolDtoType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import { LockIcon } from "lucide-react";
import type { KeyboardEvent } from "react";

import { texts } from "@/client/modules/mcp/consts/texts.const";
import { getMcpToolAreaIcon } from "@/client/modules/mcp/utils/mcp-tool-area-icon.util";

type McpToolCardProps = {
  tool: McpToolDtoType;
  onOpen: (tool: McpToolDtoType) => void;
};

export function McpToolCard({ tool, onOpen }: McpToolCardProps) {
  const AreaIcon = getMcpToolAreaIcon(tool.area);

  return (
    <Card
      gap="sm"
      className={cn("cursor-pointer transition-colors hover:bg-muted/40", tool.unavailable && "opacity-50")}
      onClick={() => onOpen(tool)}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === "Enter") onOpen(tool);
      }}
      role="button"
      tabIndex={0}
    >
      <Row align="start" justify="between" gap="sm" width="full">
        <Row align="center" gap="sm" minWidth="0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <AreaIcon className="size-4" aria-hidden="true" />
          </div>
          <Typography variant="text-sm" font="mono" className="truncate">
            {tool.name}
          </Typography>
        </Row>
        <Row align="center" gap="xs" wrap={false}>
          {tool.unavailable ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex">
                    <LockIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  </span>
                }
              />
              <TooltipContent>{texts.tools.unavailableTooltip}</TooltipContent>
            </Tooltip>
          ) : null}
          {tool.adminOnly ? <Badge variant="outline">{texts.tools.adminBadge}</Badge> : null}
          <Badge variant={tool.access === "write" ? "warning" : "secondary"}>
            {tool.access === "write" ? texts.tools.writeBadge : texts.tools.readBadge}
          </Badge>
        </Row>
      </Row>
      <Column gap="sm" width="full">
        <Typography variant="text-sm" color="muted">
          {tool.shortDescription}
        </Typography>
        <Badge variant="outline" className="w-fit">
          {tool.scope}
        </Badge>
      </Column>
    </Card>
  );
}
