import { Card } from "@workspace/design-system/components/ui/card";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { texts } from "@/client/modules/user/consts/texts.const";
import { useInterfaceLanguageForm } from "@/client/modules/user/hooks/use-interface-language-form";

type InterfaceLanguageFormProps = {
  showHeader?: boolean;
};

export function InterfaceLanguageForm({ showHeader = false }: InterfaceLanguageFormProps) {
  const { value, onValueChange, saving } = useInterfaceLanguageForm();

  const items = [
    { value: "en", label: texts.options.en, disabled: saving },
    { value: "ru", label: texts.options.ru, disabled: saving },
  ];

  return (
    <Card>
      {showHeader ? (
        <Card.Header>
          <Card.Title>{texts.title}</Card.Title>
          <Card.Description>{texts.description}</Card.Description>
        </Card.Header>
      ) : null}
      <Card.Content>
        <SegmentedControl
          value={value}
          onValueChange={onValueChange}
          items={items}
          aria-label={texts.title}
        />
      </Card.Content>
    </Card>
  );
}

function InterfaceLanguageFormFallback() {
  return <Skeleton className="h-24 w-full max-w-xs" />;
}

InterfaceLanguageForm.Fallback = InterfaceLanguageFormFallback;