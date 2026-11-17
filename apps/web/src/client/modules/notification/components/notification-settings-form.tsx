import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { SettingsSection, SettingsSections } from "@workspace/design-system/components/layout/settings-section";
import { Checkbox } from "@workspace/design-system/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Switch } from "@workspace/design-system/components/ui/switch";
import { Table } from "@workspace/design-system/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { notificationEmailDigests } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { LockIcon } from "lucide-react";

import { NotificationQuietSaved } from "@/client/modules/notification/components/notification-quiet-saved";
import { texts } from "@/client/modules/notification/consts/texts.const";
import { useNotificationSettingsForm } from "@/client/modules/notification/hooks/use-notification-settings-form";

const digestLabels: Record<(typeof notificationEmailDigests)[number], string> = {
  immediately: texts.settings.digest.immediate,
  hourly: texts.settings.digest.hourly,
  daily: texts.settings.digest.daily,
};

function rowText(group: NotificationPreferenceGroup) {
  return texts.settings.rows[group];
}

export function NotificationSettingsForm() {
  const {
    preference,
    projects,
    visibleRows,
    mutedProjectIds,
    saving,
    isSaved,
    onChannelChange,
    onToggleMutedProject,
    onEmailDigestChange,
  } = useNotificationSettingsForm();

  return (
    <SettingsSections>
      <SettingsSection
        showSeparator={false}
        title={texts.settings.matrix.sectionTitle}
        description={texts.settings.matrix.sectionDescription}
      >
        <Table>
          <Table.Header className="sticky top-0 z-10 bg-card">
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

      <SettingsSection
        title={texts.settings.digest.sectionTitle}
        description={texts.settings.digest.sectionDescription}
      >
        <Field>
          <FieldLabel htmlFor="email-digest">{texts.settings.digest.label}</FieldLabel>
          <Select
            value={preference.emailDigest}
            onValueChange={(value) => onEmailDigestChange(value as (typeof notificationEmailDigests)[number])}
            disabled={saving}
          >
            <SelectTrigger id="email-digest" aria-label={texts.settings.digest.label}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {notificationEmailDigests.map((digest) => (
                <SelectItem key={digest} value={digest}>
                  {digestLabels[digest]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <NotificationQuietSaved visible={isSaved("digest")} />
      </SettingsSection>
    </SettingsSections>
  );
}

function NotificationSettingsFormFallback() {
  return <Skeleton className="h-96 w-full max-w-4xl" />;
}

NotificationSettingsForm.Fallback = NotificationSettingsFormFallback;
