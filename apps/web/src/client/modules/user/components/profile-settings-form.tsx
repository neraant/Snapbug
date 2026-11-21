import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import {
  SettingsSection,
  SettingsSectionFormFooter,
  SettingsSections,
} from "@workspace/design-system/components/layout/settings-section";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@workspace/design-system/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { formatPersonInitials } from "@/client/modules/overview/utils/format-person-initials.util";
import { texts } from "@/client/modules/user/consts/texts.const";
import { useChangePasswordSection } from "@/client/modules/user/hooks/use-change-password-section";
import { useProfileSettingsForm } from "@/client/modules/user/hooks/use-profile-settings-form";
import { useProfileTimeZone } from "@/client/modules/user/hooks/use-profile-time-zone";

export function ProfileSettingsForm() {
  const { user, control, onSubmit, saving, isDirty, savedVisible } = useProfileSettingsForm();
  const changePassword = useChangePasswordSection();
  const timeZone = useProfileTimeZone();

  const displayName = user.name?.trim() || user.email;
  const initials = formatPersonInitials(user.name, user.email);

  return (
    <Column gap="none" width="full">
      <Column as="form" width="full" gap="none" onSubmit={onSubmit}>
        <SettingsSections>
          <SettingsSection
            showSeparator={false}
            title={texts.profile.displayName.sectionTitle}
            description={texts.profile.displayName.sectionDescription}
          >
            <FieldGroup>
              <TextField
                control={control}
                name="name"
                inputId="profile-display-name"
                type="text"
                label={texts.profile.displayName.label}
                autoComplete="name"
              />
            </FieldGroup>
            <SettingsSectionFormFooter>
              <Button type="submit" disabled={saving || !isDirty}>
                {texts.profile.displayName.save}
              </Button>
              {savedVisible ? (
                <Row gap="xs" align="center">
                  <CheckIcon className="size-4 text-success" aria-hidden="true" />
                  <Typography variant="text-sm" color="muted">
                    {texts.saved}
                  </Typography>
                </Row>
              ) : null}
            </SettingsSectionFormFooter>
          </SettingsSection>

          <SettingsSection
            title={texts.profile.email.sectionTitle}
            description={texts.profile.email.sectionDescription}
          >
            <Column gap="xs" align="start">
              <Typography variant="text-sm">{user.email}</Typography>
              <Typography variant="text-sm" color="muted">
                {texts.profile.email.hint}
              </Typography>
            </Column>
          </SettingsSection>

          <SettingsSection
            title={texts.profile.avatar.sectionTitle}
            description={texts.profile.avatar.sectionDescription}
          >
            <Row gap="md" align="center">
              <Avatar size="lg" aria-label={displayName}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Typography variant="text-sm">{displayName}</Typography>
            </Row>
          </SettingsSection>
        </SettingsSections>
      </Column>

      <SettingsSections>
        <SettingsSection
          title={texts.changePassword.sectionTitle}
          description={texts.changePassword.sectionDescription}
        >
          <Button type="button" variant="outline" onClick={changePassword.onToggle}>
            {texts.changePassword.toggle}
            {changePassword.open ? (
              <ChevronUpIcon className="size-4" aria-hidden="true" />
            ) : (
              <ChevronDownIcon className="size-4" aria-hidden="true" />
            )}
          </Button>
          {changePassword.open ? (
            <Column as="form" gap="md" width="full" onSubmit={changePassword.onSubmit}>
              <FieldGroup>
                <PasswordField
                  control={changePassword.control}
                  name="currentPassword"
                  label={texts.changePassword.currentPassword.label}
                  autoComplete="current-password"
                />
                <PasswordField
                  control={changePassword.control}
                  name="newPassword"
                  label={texts.changePassword.newPassword.label}
                  autoComplete="new-password"
                />
                <PasswordField
                  control={changePassword.control}
                  name="confirmPassword"
                  label={texts.changePassword.confirmPassword.label}
                  autoComplete="new-password"
                />
              </FieldGroup>
              <SettingsSectionFormFooter>
                <Button type="submit" disabled={changePassword.saving || !changePassword.canSubmit}>
                  {texts.changePassword.submit}
                </Button>
              </SettingsSectionFormFooter>
            </Column>
          ) : null}
        </SettingsSection>
      </SettingsSections>

      <SettingsSections>
        <SettingsSection
          showSeparator={false}
          title={texts.timeZone.sectionTitle}
          description={texts.timeZone.sectionDescription}
        >
          <Field>
            <FieldDescription>{timeZone.hint}</FieldDescription>
            <Select
              value={timeZone.value}
              onValueChange={(value) => {
                if (value) timeZone.onValueChange(value);
              }}
              disabled={timeZone.saving}
            >
              <SelectTrigger aria-label={texts.timeZone.label}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeZone.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {timeZone.savedVisible ? (
            <SettingsSectionFormFooter>
              <Row gap="xs" align="center">
                <CheckIcon className="size-4 text-success" aria-hidden="true" />
                <Typography variant="text-sm" color="muted">
                  {texts.saved}
                </Typography>
              </Row>
            </SettingsSectionFormFooter>
          ) : null}
        </SettingsSection>
      </SettingsSections>
    </Column>
  );
}

function ProfileSettingsFormFallback() {
  return (
    <Column gap="lg" width="full" className="max-w-4xl">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
    </Column>
  );
}

ProfileSettingsForm.Fallback = ProfileSettingsFormFallback;
