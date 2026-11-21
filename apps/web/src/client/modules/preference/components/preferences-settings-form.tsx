import { Row } from "@workspace/design-system/components/layout/row";
import {
  SettingsSection,
  SettingsSectionFormFooter,
  SettingsSections,
} from "@workspace/design-system/components/layout/settings-section";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { userPreferenceThemeValues } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { CheckIcon } from "lucide-react";

import { PreferenceQuietSaved } from "@/client/modules/preference/components/preference-quiet-saved";
import { ThemeOption } from "@/client/modules/preference/components/theme-option";
import { texts } from "@/client/modules/preference/consts/texts.const";
import { useInterfaceLanguageForm } from "@/client/modules/preference/hooks/use-interface-language-form";
import { usePreferencesSettingsForm } from "@/client/modules/preference/hooks/use-preferences-settings-form";

export function PreferencesSettingsForm() {
  const language = useInterfaceLanguageForm();
  const { theme, saving, isSaved, onThemeChange } = usePreferencesSettingsForm();

  const themeLabels = {
    light: texts.theme.light,
    dark: texts.theme.dark,
    system: texts.theme.system,
  } as const;

  const languageItems = [
    { value: "en", label: texts.language.options.en, disabled: language.saving },
    { value: "ru", label: texts.language.options.ru, disabled: language.saving },
  ];

  return (
    <SettingsSections>
      <SettingsSection
        showSeparator={false}
        title={texts.language.sectionTitle}
        description={texts.language.sectionDescription}
      >
        <SegmentedControl
          value={language.value}
          onValueChange={language.onValueChange}
          items={languageItems}
          aria-label={texts.language.sectionTitle}
        />
        {language.savedVisible ? (
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

      <SettingsSection title={texts.theme.sectionTitle} description={texts.theme.sectionDescription}>
        <Row gap="sm" width="full">
          {userPreferenceThemeValues.map((value) => (
            <ThemeOption
              key={value}
              value={value}
              label={themeLabels[value]}
              selected={theme === value}
              disabled={saving}
              onSelect={onThemeChange}
            />
          ))}
        </Row>
        <PreferenceQuietSaved visible={isSaved("theme")} />
      </SettingsSection>
    </SettingsSections>
  );
}

function PreferencesSettingsFormFallback() {
  return (
    <>
      <Skeleton className="mb-6 h-24 w-full max-w-4xl" />
      <Skeleton className="h-48 w-full max-w-4xl" />
    </>
  );
}

PreferencesSettingsForm.Fallback = PreferencesSettingsFormFallback;