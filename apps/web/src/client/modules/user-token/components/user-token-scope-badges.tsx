import { Badge } from "@workspace/design-system/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import type { McpToolScopeType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import type { UserTokenScopePresetType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";

import { texts } from "@/client/modules/user-token/consts/texts.const";

type UserTokenScopeBadgesProps = {
  scopePreset: UserTokenScopePresetType | null;
  scopes: McpToolScopeType[];
  projectIds: string[] | null;
};

const presetLabel: Record<UserTokenScopePresetType, string> = {
  readOnly: texts.scopes.presetReadOnly,
  readAndComment: texts.scopes.presetReadAndComment,
  fullAccess: texts.scopes.presetFullAccess,
  custom: texts.scopes.presetCustom,
};

const scopeLabel: Record<McpToolScopeType, string> = {
  "tickets:read": "tickets:read",
  "tickets:write": "tickets:write",
  "comments:read": "comments:read",
  "comments:write": "comments:write",
  "projects:read": "projects:read",
  "members:read": "members:read",
  "stats:read": "stats:read",
  "activity:read": "activity:read",
};

export function UserTokenScopeBadges({ scopePreset, scopes, projectIds }: UserTokenScopeBadgesProps) {
  if (scopePreset && scopePreset !== "custom") {
    return (
      <RowBadges
        chips={[presetLabel[scopePreset]]}
        tooltip={scopes.map((scope) => scopeLabel[scope]).join(", ")}
        projectLabel={projectIds ? texts.scopes.projectsCount(projectIds.length) : texts.scopes.allProjects}
      />
    );
  }

  const chips = scopes.slice(0, 2).map((scope) => scopeLabel[scope]);
  const extra = scopes.length > 2 ? texts.scopes.more(scopes.length - 2) : null;

  return (
    <RowBadges
      chips={extra ? [...chips, extra] : chips}
      tooltip={scopes.map((scope) => scopeLabel[scope]).join(", ")}
      projectLabel={projectIds ? texts.scopes.projectsCount(projectIds.length) : texts.scopes.allProjects}
    />
  );
}

function RowBadges({ chips, tooltip, projectLabel }: { chips: string[]; tooltip: string; projectLabel: string }) {
  return (
    <>
      {chips.map((chip) => (
        <Tooltip key={chip}>
          <TooltipTrigger render={<Badge variant="secondary" />}>{chip}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ))}
      <Badge variant="outline">{projectLabel}</Badge>
    </>
  );
}
