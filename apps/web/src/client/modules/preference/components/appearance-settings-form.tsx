import { Grid } from "@workspace/design-system/components/layout/grid";
import { Row } from "@workspace/design-system/components/layout/row";
import { SettingsSection, SettingsSections } from "@workspace/design-system/components/layout/settings-section";
import { ColorSwatchButton } from "@workspace/design-system/components/ui/color-swatch-button";
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Switch } from "@workspace/design-system/components/ui/switch";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { userPreferenceAccentValues } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import { userPreferenceLandingPageValues } from "@workspace/validation/modules/preference/consts/user-preference-landing-page.const";
import { userPreferenceThemeValues } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";

import { AppearanceLivePreview } from "@/client/modules/preference/components/appearance-live-preview";
import { AppearanceQuietSaved } from "@/client/modules/preference/components/appearance-quiet-saved";
import { AppearanceThemeOption } from "@/client/modules/preference/components/appearance-theme-option";
import { texts } from "@/client/modules/preference/consts/texts.const";
import { useAppearanceSettingsForm } from "@/client/modules/preference/hooks/use-appearance-settings-form";

export function AppearanceSettingsForm() {
  const {
    preference,
    saving,
    isSaved,
    onThemeChange,
    onAccentChange,
    onDensityChange,
    onDateFormatChange,
    onUse24HourTimeChange,
    onReduceMotionChange,
    onResetReduceMotionToSystem,
    onDefaultLandingPageChange,
    onSidebarCollapsedChange,
    reduceMotionChecked,
    reduceMotionUsesSystem,
  } = useAppearanceSettingsForm();

  const themeLabels = {
    light: texts.theme.light,
    dark: texts.theme.dark,
    system: texts.theme.system,
  } as const;

  return (
    <Grid gap="xl" className="w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
      <SettingsSections>
        <SettingsSection
          showSeparator={false}
          title={texts.theme.sectionTitle}
          description={texts.theme.sectionDescription}
        >
          <Row gap="sm" width="full">
            {userPreferenceThemeValues.map((theme) => (
              <AppearanceThemeOption
                key={theme}
                value={theme}
                label={themeLabels[theme]}
                selected={preference.theme === theme}
                disabled={saving}
                onSelect={onThemeChange}
              />
            ))}
          </Row>
          <AppearanceQuietSaved visible={isSaved("theme")} />
        </SettingsSection>

        <SettingsSection title={texts.accent.sectionTitle} description={texts.accent.sectionDescription}>
          <Row gap="sm" wrap>
            {userPreferenceAccentValues.map((accent) => (
              <ColorSwatchButton
                key={accent}
                color={accent}
                selected={preference.accent === accent}
                label={texts.accent.swatchLabel(accent)}
                disabled={saving}
                onClick={() => onAccentChange(accent)}
              />
            ))}
          </Row>
          <AppearanceQuietSaved visible={isSaved("accent")} />
        </SettingsSection>

        <SettingsSection title={texts.density.sectionTitle} description={texts.density.sectionDescription}>
          <SegmentedControl
            aria-label={texts.density.sectionTitle}
            value={preference.density}
            onValueChange={(value) => onDensityChange(value as typeof preference.density)}
            items={[
              { value: "comfortable", label: texts.density.comfortable, disabled: saving },
              { value: "compact", label: texts.density.compact, disabled: saving },
            ]}
          />
          <AppearanceQuietSaved visible={isSaved("density")} />
        </SettingsSection>

        <SettingsSection title={texts.dateFormat.sectionTitle} description={texts.dateFormat.sectionDescription}>
          <Field>
            <FieldLabel>{texts.dateFormat.formatLabel}</FieldLabel>
            <Select
              value={preference.dateFormat}
              onValueChange={(value) => onDateFormatChange(value as typeof preference.dateFormat)}
              disabled={saving}
            >
              <SelectTrigger aria-label={texts.dateFormat.formatLabel}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relative">{texts.dateFormat.relative}</SelectItem>
                <SelectItem value="absolute">{texts.dateFormat.absolute}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {preference.dateFormat === "absolute" ? (
            <Field orientation="horizontal">
              <FieldLabel htmlFor="use-24-hour">{texts.dateFormat.use24Hour}</FieldLabel>
              <Switch
                id="use-24-hour"
                checked={preference.use24HourTime}
                disabled={saving}
                onCheckedChange={onUse24HourTimeChange}
              />
            </Field>
          ) : null}
          <AppearanceQuietSaved visible={isSaved("date-format")} />
        </SettingsSection>

        <SettingsSection title={texts.reduceMotion.sectionTitle} description={texts.reduceMotion.sectionDescription}>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="reduce-motion">{texts.reduceMotion.label}</FieldLabel>
            <Switch
              id="reduce-motion"
              checked={reduceMotionChecked}
              disabled={saving}
              onCheckedChange={onReduceMotionChange}
            />
          </Field>
          {reduceMotionUsesSystem ? (
            <FieldDescription>{texts.reduceMotion.followsSystem}</FieldDescription>
          ) : (
            <Typography
              as="button"
              type="button"
              variant="text-sm"
              color="primary"
              className="text-left underline-offset-4 hover:underline"
              onClick={onResetReduceMotionToSystem}
            >
              {texts.reduceMotion.useSystem}
            </Typography>
          )}
          <AppearanceQuietSaved visible={isSaved("reduce-motion")} />
        </SettingsSection>

        <SettingsSection title={texts.landingPage.sectionTitle} description={texts.landingPage.sectionDescription}>
          <Select
            value={preference.defaultLandingPage}
            onValueChange={(value) => onDefaultLandingPageChange(value as typeof preference.defaultLandingPage)}
            disabled={saving}
          >
            <SelectTrigger aria-label={texts.landingPage.sectionTitle}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {userPreferenceLandingPageValues.map((page) => (
                <SelectItem key={page} value={page}>
                  {page === "overview" ? texts.landingPage.overview : texts.landingPage.tickets}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AppearanceQuietSaved visible={isSaved("landing-page")} />
        </SettingsSection>

        <SettingsSection title={texts.sidebar.sectionTitle} description={texts.sidebar.sectionDescription}>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="sidebar-collapsed">{texts.sidebar.collapsed}</FieldLabel>
            <Switch
              id="sidebar-collapsed"
              checked={preference.sidebarCollapsed}
              disabled={saving}
              onCheckedChange={onSidebarCollapsedChange}
            />
          </Field>
          <AppearanceQuietSaved visible={isSaved("sidebar")} />
        </SettingsSection>
      </SettingsSections>

      <AppearanceLivePreview preference={preference} />
    </Grid>
  );
}

function AppearanceSettingsFormFallback() {
  return <Skeleton className="h-96 w-full max-w-4xl" />;
}

AppearanceSettingsForm.Fallback = AppearanceSettingsFormFallback;
