import { Row } from "@workspace/design-system/components/layout/row";
import {
  SettingsSection,
  SettingsSectionFormFooter,
  SettingsSections,
} from "@workspace/design-system/components/layout/settings-section";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CheckIcon } from "lucide-react";

import { texts } from "@/client/modules/user/consts/texts.const";
import { useInterfaceLanguageForm } from "@/client/modules/user/hooks/use-interface-language-form";

export function InterfaceLanguageForm() {
  const { value, onValueChange, saving, savedVisible } = useInterfaceLanguageForm();

  const items = [
    { value: "en", label: texts.options.en, disabled: saving },
    { value: "ru", label: texts.options.ru, disabled: saving },
  ];

  return (
    <SettingsSections>
      <SettingsSection
        showSeparator={false}
        title={texts.sectionTitle}
        description={texts.sectionDescription}
      >
        <SegmentedControl
          value={value}
          onValueChange={onValueChange}
          items={items}
          aria-label={texts.sectionTitle}
        />
        {savedVisible ? (
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
  );
}

function InterfaceLanguageFormFallback() {
  return <Skeleton className="h-24 w-full max-w-4xl" />;
}

InterfaceLanguageForm.Fallback = InterfaceLanguageFormFallback;