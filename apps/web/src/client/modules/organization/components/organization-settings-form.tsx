import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { texts } from "@/client/modules/organization/consts/texts.const";
import { useOrganizationSettingsForm } from "@/client/modules/organization/hooks/use-organization-settings-form";

export function OrganizationSettingsForm() {
  const { control, onSubmit, saving } = useOrganizationSettingsForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>{texts.title}</Card.Title>
        <Card.Description>{texts.description}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Column as="form" width="full" gap="lg" onSubmit={onSubmit}>
          <FieldGroup>
            <TextField control={control} name="name" type="text" label={texts.name.label} autoComplete="organization" />
            <TextField
              control={control}
              name="reportsRetentionDays"
              type="text"
              inputMode="numeric"
              label={texts.retention.label}
              description={texts.retention.description}
            />
          </FieldGroup>
          <Button type="submit" disabled={saving}>
            {texts.save}
          </Button>
        </Column>
      </Card.Content>
    </Card>
  );
}

function OrganizationSettingsFormFallback() {
  return <Skeleton className="h-64 w-full" />;
}

OrganizationSettingsForm.Fallback = OrganizationSettingsFormFallback;
