import { SelectField } from "@workspace/design-system/components/forms/select-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import {
  SettingsSection,
  SettingsSectionFormFooter,
  SettingsSections,
} from "@workspace/design-system/components/layout/settings-section";
import { Button } from "@workspace/design-system/components/ui/button";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CheckIcon } from "lucide-react";
import { useEffect } from "react";

import { texts } from "@/client/modules/organization/consts/texts.const";
import { useOrganizationSettingsForm } from "@/client/modules/organization/hooks/use-organization-settings-form";

type OrganizationSettingsFormProps = {
  readOnly?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
  onResetRegister?: (reset: VoidFunction) => void;
};

export function OrganizationSettingsForm({
  readOnly = false,
  onDirtyChange,
  onResetRegister,
}: OrganizationSettingsFormProps) {
  const {
    control,
    onSubmit,
    saving,
    isDirty,
    savedVisible,
    setSavedVisible,
    resetToSaved,
    retentionOptions,
    organization,
  } = useOrganizationSettingsForm({ onDirtyChange });

  useEffect(() => {
    onResetRegister?.(resetToSaved);
  }, [onResetRegister, resetToSaved]);

  useEffect(() => {
    if (isDirty) {
      setSavedVisible(false);
    }
  }, [isDirty, setSavedVisible]);

  if (!organization) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (readOnly) {
    return (
      <SettingsSections>
        <SettingsSection
          showSeparator={false}
          title={texts.name.sectionTitle}
          description={texts.name.sectionDescription}
        >
          <Typography variant="text-sm">{organization.name}</Typography>
        </SettingsSection>
        <SettingsSection title={texts.retention.sectionTitle} description={texts.retention.sectionDescription}>
          <Typography variant="text-sm">{texts.retention.days(organization.reports_retention_days)}</Typography>
        </SettingsSection>
      </SettingsSections>
    );
  }

  return (
    <Column as="form" width="full" gap="none" onSubmit={onSubmit}>
      <SettingsSections>
        <SettingsSection
          showSeparator={false}
          title={texts.name.sectionTitle}
          description={texts.name.sectionDescription}
        >
          <FieldGroup>
            <TextField
              control={control}
              name="name"
              inputId="organization-name"
              type="text"
              label={texts.name.label}
              autoComplete="organization"
            />
          </FieldGroup>
        </SettingsSection>
        <SettingsSection title={texts.retention.sectionTitle} description={texts.retention.sectionDescription}>
          <FieldGroup>
            <SelectField
              control={control}
              name="reportsRetentionDays"
              label={texts.retention.label}
              options={retentionOptions}
            />
          </FieldGroup>
          <SettingsSectionFormFooter>
            <Button type="submit" disabled={saving || !isDirty}>
              {texts.save}
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
      </SettingsSections>
    </Column>
  );
}

function OrganizationSettingsFormFallback() {
  return (
    <Column gap="lg" width="full" className="max-w-4xl">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
    </Column>
  );
}

OrganizationSettingsForm.Fallback = OrganizationSettingsFormFallback;
