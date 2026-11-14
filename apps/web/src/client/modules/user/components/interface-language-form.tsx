import { RadioGroupField } from "@workspace/design-system/components/forms/radio-group-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { texts } from "@/client/modules/user/consts/texts.const";
import { useInterfaceLanguageForm } from "@/client/modules/user/hooks/use-interface-language-form";

export function InterfaceLanguageForm() {
  const { control, onSubmit, saving } = useInterfaceLanguageForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>{texts.title}</Card.Title>
        <Card.Description>{texts.description}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Column as="form" width="full" gap="lg" onSubmit={onSubmit}>
          <FieldGroup>
            <RadioGroupField
              control={control}
              name="interfaceLanguage"
              label={texts.title}
              description={texts.description}
              options={[
                { value: "en", label: texts.options.en },
                { value: "ru", label: texts.options.ru },
              ]}
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

function InterfaceLanguageFormFallback() {
  return <Skeleton className="h-48 w-full" />;
}

InterfaceLanguageForm.Fallback = InterfaceLanguageFormFallback;
