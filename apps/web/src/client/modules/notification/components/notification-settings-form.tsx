import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { SettingsSection, SettingsSections } from "@workspace/design-system/components/layout/settings-section";
import { Checkbox } from "@workspace/design-system/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Switch } from "@workspace/design-system/components/ui/switch";
import { Table } from "@workspace/design-system/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { LockIcon } from "lucide-react";

import { NotificationQuietSaved } from "@/client/modules/notification/components/notification-quiet-saved";
import { texts } from "@/client/modules/notification/consts/texts.const";
import { useNotificationSettingsForm } from "@/client/modules/notification/hooks/use-notification-settings-form";

function rowText(group: NotificationPreferenceGroup) {
  return texts.settings.rows[group];
}

export function NotificationSettingsForm() {
  const { preference, projects, visibleRows, mutedProjectIds, saving, isSaved, onChannelChange, onToggleMutedProject } =
    useNotificationSettingsForm();

  return (
    <SettingsSections>
      <SettingsSection
        showSeparator={false}
        title={texts.settings.matrix.sectionTitle}
        description={texts.settings.matrix.sectionDescription}
      >
        <Table.Shell>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-[45%] min-w-[12rem]">{""}</Table.Head>
                <Table.Head className="w-[1%] text-right">{texts.settings.matrix.inApp}</Table.Head>
                <Table.Head className="w-[1%] text-right">{texts.settings.matrix.email}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleRows.map((row) => {
                const copy = rowText(row.group);
                const channels = preference.channels[row.group];
                const rowId = `notification-row-${row.group}`;

                return (
                  <Table.Row key={row.group}>
                    <Table.Cell className="align-top whitespace-normal">
                      <Column gap="xs" minWidth="0">
                        <Typography id={rowId} variant="text-sm" weight="medium">
                          {copy.title}
                        </Typography>
                        <Typography variant="text-sm" color="muted">
                          {copy.description}
                        </Typography>
                      </Column>
                    </Table.Cell>
                    <Table.Cell className="text-right align-middle">
                      {row.locked ? (
                        <Row gap="xs" align="center" justify="end">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <span className="inline-flex size-9 items-center justify-center text-muted-foreground">
                                  <LockIcon className="size-4" aria-hidden="true" />
                                </span>
                              }
                            />
                            <TooltipContent>{texts.settings.matrix.lockedTooltip}</TooltipContent>
                          </Tooltip>
                        </Row>
                      ) : (
                        <Switch
                          aria-label={texts.settings.switch.inApp(copy.title)}
                          checked={channels?.inApp ?? false}
                          disabled={saving}
                          onCheckedChange={(checked) => onChannelChange(row.group, "inApp", checked)}
                        />
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-right align-middle">
                      {row.locked ? (
                        <Row gap="xs" align="center" justify="end">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <span className="inline-flex size-9 items-center justify-center text-muted-foreground">
                                  <LockIcon className="size-4" aria-hidden="true" />
                                </span>
                              }
                            />
                            <TooltipContent>{texts.settings.matrix.lockedTooltip}</TooltipContent>
                          </Tooltip>
                        </Row>
                      ) : (
                        <Switch
                          aria-label={texts.settings.switch.email(copy.title)}
                          checked={channels?.email ?? false}
                          disabled={saving}
                          onCheckedChange={(checked) => onChannelChange(row.group, "email", checked)}
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Table.Shell>
        <NotificationQuietSaved visible={isSaved("matrix")} />
      </SettingsSection>

      <SettingsSection title={texts.settings.mute.sectionTitle} description={texts.settings.mute.sectionDescription}>
        {projects.length === 0 ? (
          <FieldDescription>{texts.settings.mute.empty}</FieldDescription>
        ) : (
          <Column gap="sm">
            {projects.map((project) => (
              <Field key={project.id} orientation="horizontal">
                <Checkbox
                  id={`mute-project-${project.id}`}
                  checked={mutedProjectIds.has(project.id)}
                  disabled={saving}
                  onCheckedChange={(value) => onToggleMutedProject(project.id, value === true)}
                  aria-label={texts.settings.mute.projectCheckbox(project.name)}
                />
                <FieldLabel htmlFor={`mute-project-${project.id}`}>{project.name}</FieldLabel>
              </Field>
            ))}
          </Column>
        )}
        <NotificationQuietSaved visible={isSaved("mute")} />
      </SettingsSection>
    </SettingsSections>
  );
}

function NotificationSettingsFormFallback() {
  return <Skeleton className="h-96 w-full max-w-4xl" />;
}

NotificationSettingsForm.Fallback = NotificationSettingsFormFallback;
