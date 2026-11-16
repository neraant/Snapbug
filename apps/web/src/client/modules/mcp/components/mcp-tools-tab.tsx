import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { McpToolAreaType, McpToolDtoType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import { useMemo, useState } from "react";

import { McpToolCard } from "@/client/modules/mcp/components/mcp-tool-card";
import { McpToolDetailSheet } from "@/client/modules/mcp/components/mcp-tool-detail-sheet";
import { type McpToolAccessFilter, mcpToolAccessFilters } from "@/client/modules/mcp/consts/mcp-tool-filter.const";
import { texts } from "@/client/modules/mcp/consts/texts.const";
import { filterMcpTools } from "@/client/modules/mcp/utils/filter-mcp-tools.util";
import { groupMcpToolsByArea } from "@/client/modules/mcp/utils/group-mcp-tools-by-area.util";
import { useFindMcpTools } from "@/client/modules/shared/queries/use-find-mcp-tools";

const areaOptions: McpToolAreaType[] = ["tickets", "comments", "projects", "members", "overview", "search", "activity"];

function McpToolsTabFallback() {
  return (
    <Grid gap="md" columns={1} className="lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </Grid>
  );
}

export function McpToolsTab() {
  const { data, isPending, isError, refetch, isRefetching } = useFindMcpTools();
  const [search, setSearch] = useState("");
  const [access, setAccess] = useState<McpToolAccessFilter>(mcpToolAccessFilters.all);
  const [area, setArea] = useState<McpToolAreaType | "all">("all");
  const [selectedTool, setSelectedTool] = useState<McpToolDtoType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const accessItems = useMemo(
    () => [
      { value: mcpToolAccessFilters.all, label: texts.tools.accessAll },
      { value: mcpToolAccessFilters.read, label: texts.tools.accessRead },
      { value: mcpToolAccessFilters.write, label: texts.tools.accessWrite },
    ],
    [],
  );

  if (isPending) {
    return <McpToolsTabFallback />;
  }

  if (isError || !data) {
    return (
      <Column align="center" gap="md" padding="lg" width="full">
        <Typography variant="text-sm" color="muted">
          {texts.tools.loadError}
        </Typography>
        <Button type="button" variant="outline" disabled={isRefetching} onClick={() => refetch()}>
          {texts.tools.retry}
        </Button>
      </Column>
    );
  }

  const filtered = filterMcpTools({
    tools: data.tools,
    search,
    access,
    area: area === "all" ? undefined : area,
  });
  const grouped = groupMcpToolsByArea(filtered);

  const openTool = (tool: McpToolDtoType) => {
    setSelectedTool(tool);
    setSheetOpen(true);
  };

  return (
    <Column gap="md" width="full">
      <Typography variant="text-sm" color="muted">
        {texts.tools.summary(data.summary.total, data.summary.read, data.summary.write)}
      </Typography>
      <Row align="center" gap="sm" wrap className="w-full">
        <SearchInput
          width="sm"
          aria-label={texts.tools.searchLabel}
          placeholder={texts.tools.searchPlaceholder}
          clearLabel={texts.tools.searchClear}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <SegmentedControl
          size="sm"
          aria-label={texts.tools.accessFilterLabel}
          value={access}
          items={accessItems}
          onValueChange={(value) => setAccess(value as McpToolAccessFilter)}
        />
        <Select
          value={area}
          onValueChange={(value) => {
            if (!value) return;
            setArea(value as McpToolAreaType | "all");
          }}
        >
          <SelectTrigger aria-label={texts.tools.groupLabel} className="w-[180px]">
            <SelectValue placeholder={texts.tools.groupAll} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{texts.tools.groupAll}</SelectItem>
            {areaOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {texts.tools.areas[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>

      {filtered.length === 0 ? (
        <Typography variant="text-sm" color="muted">
          {texts.tools.emptySearch}
        </Typography>
      ) : (
        <Column gap="lg" width="full">
          {grouped.map((group) => (
            <Column key={group.area} gap="sm" width="full">
              <Typography variant="heading-xs">{texts.tools.areas[group.area]}</Typography>
              <Grid gap="md" columns={1} className="lg:grid-cols-2">
                {group.tools.map((tool) => (
                  <McpToolCard key={tool.name} tool={tool} onOpen={openTool} />
                ))}
              </Grid>
            </Column>
          ))}
        </Column>
      )}

      <McpToolDetailSheet
        tool={selectedTool}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelectedTool(null);
        }}
      />
    </Column>
  );
}

McpToolsTab.Fallback = McpToolsTabFallback;
