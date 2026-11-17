import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Checkbox } from "@workspace/design-system/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@workspace/design-system/components/ui/radio-group";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { McpToolScopeType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import type { UserTokenScopePresetType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { MCP_SCOPE_GROUPS } from "@workspace/validation/modules/user-token/consts/mcp-scope-meta.const";

import { texts } from "@/client/modules/user-token/consts/texts.const";

type CreateUserTokenPermissionsProps = {
  preset: UserTokenScopePresetType;
  customScopes: McpToolScopeType[];
  projectMode: "all" | "selected";
  selectedProjectIds: string[];
  projects: { id: string; name: string }[];
  toolSummary: string;
  isPending: boolean;
  onPresetChange: (preset: UserTokenScopePresetType) => void;
  onToggleScope: (scope: McpToolScopeType, checked: boolean) => void;
  onProjectModeChange: (mode: "all" | "selected") => void;
  onToggleProject: (projectId: string, checked: boolean) => void;
};

const presetItems = [
  { value: "readOnly", label: texts.create.dialog.presetReadOnly },
  { value: "readAndComment", label: texts.create.dialog.presetReadAndComment },
  { value: "fullAccess", label: texts.create.dialog.presetFullAccess },
  { value: "custom", label: texts.create.dialog.presetCustom },
] as const;

export function CreateUserTokenPermissions({
  preset,
  customScopes,
  projectMode,
  selectedProjectIds,
  projects,
  toolSummary,
  isPending,
  onPresetChange,
  onToggleScope,
  onProjectModeChange,
  onToggleProject,
}: CreateUserTokenPermissionsProps) {
  return (
    <Column gap="lg" width="full">
      <Column gap="sm" width="full">
        <Typography variant="heading-xs">{texts.create.dialog.permissionsTitle}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.create.dialog.permissionsDescription}
        </Typography>
        <SegmentedControl
          value={preset}
          onValueChange={(value) => onPresetChange(value as UserTokenScopePresetType)}
          items={[...presetItems]}
          aria-label={texts.create.dialog.permissionsTitle}
        />
        {preset === "custom" ? (
          <Column gap="md" width="full">
            {MCP_SCOPE_GROUPS.map((group) => {
              const groupText = texts.create.dialog.groups[group.id];
              const scopes: { scope: McpToolScopeType; label: string; isWrite?: boolean }[] = [
                { scope: group.readScope, label: texts.scopes.read },
              ];
              if (group.writeScope) {
                scopes.push({ scope: group.writeScope, label: texts.scopes.write, isWrite: true });
              }

              return (
                <Column key={group.id} gap="sm" width="full">
                  <Typography variant="label">{groupText.label}</Typography>
                  <Typography variant="text-sm" color="muted">
                    {groupText.description}
                  </Typography>
                  <Row gap="xs" wrap>
                    {group.toolNames.map((toolName) => (
                      <Badge key={toolName} variant="secondary" className="font-mono">
                        {toolName}
                      </Badge>
                    ))}
                  </Row>
                  {scopes.map((item) => (
                    <Field key={item.scope} orientation="horizontal">
                      <Checkbox
                        id={`scope-${item.scope}`}
                        checked={customScopes.includes(item.scope)}
                        disabled={isPending}
                        onCheckedChange={(value) => onToggleScope(item.scope, value === true)}
                        aria-label={`${groupText.label} ${item.label}`}
                      />
                      <FieldLabel htmlFor={`scope-${item.scope}`}>{item.label}</FieldLabel>
                      {item.isWrite ? (
                        <FieldDescription className="text-warning">
                          {texts.create.dialog.writeScopeWarning}
                        </FieldDescription>
                      ) : null}
                    </Field>
                  ))}
                </Column>
              );
            })}
          </Column>
        ) : null}
        <Typography variant="text-sm" color="muted">
          {toolSummary}
        </Typography>
      </Column>

      <Column gap="sm" width="full">
        <Typography variant="heading-xs">{texts.create.dialog.projectsTitle}</Typography>
        <RadioGroup value={projectMode} onValueChange={(value) => onProjectModeChange(value as "all" | "selected")}>
          <Field orientation="horizontal">
            <RadioGroupItem value="all" id="token-projects-all" disabled={isPending} />
            <FieldLabel htmlFor="token-projects-all">{texts.create.dialog.projectsAll}</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="selected" id="token-projects-selected" disabled={isPending} />
            <FieldLabel htmlFor="token-projects-selected">{texts.create.dialog.projectsSelected}</FieldLabel>
          </Field>
        </RadioGroup>
        {projectMode === "selected" ? (
          projects.length === 0 ? (
            <FieldDescription>{texts.create.dialog.projectsEmpty}</FieldDescription>
          ) : (
            <Column gap="sm">
              {projects.map((project) => (
                <Field key={project.id} orientation="horizontal">
                  <Checkbox
                    id={`token-project-${project.id}`}
                    checked={selectedProjectIds.includes(project.id)}
                    disabled={isPending}
                    onCheckedChange={(value) => onToggleProject(project.id, value === true)}
                    aria-label={texts.create.dialog.projectCheckbox(project.name)}
                  />
                  <FieldLabel htmlFor={`token-project-${project.id}`}>{project.name}</FieldLabel>
                </Field>
              ))}
            </Column>
          )
        ) : null}
      </Column>
    </Column>
  );
}
