import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { ColorSwatchButton } from "@workspace/design-system/components/ui/color-swatch-button";
import { Input } from "@workspace/design-system/components/ui/input";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Switch } from "@workspace/design-system/components/ui/switch";
import { TagsInput } from "@workspace/design-system/components/ui/tags-input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import {
  projectWidgetSettingAccentValues,
  type ProjectWidgetSettingModelType,
} from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { projectWidgetSettingFontValues } from "@workspace/validation/shared/project-widget-setting-font.schema";
import { InfoIcon } from "lucide-react";
import { useMemo } from "react";

import { SdkSetupWidgetColorPicker } from "@/client/modules/sdk-setup/components/sdk-setup-widget-color-picker";
import { SdkSetupWidgetSettingField } from "@/client/modules/sdk-setup/components/sdk-setup-widget-setting-field";
import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useSdkSetupWidgetSetting } from "@/client/modules/sdk-setup/hooks/use-sdk-setup-widget-setting";

type SdkSetupWidgetSettingsCardProps = {
  projectId: string;
};

export function SdkSetupWidgetSettingsCard({ projectId }: SdkSetupWidgetSettingsCardProps) {
  const {
    settings,
    buttonLabelDraft,
    setButtonLabelDraft,
    buttonLabelError,
    backgroundDraft,
    backgroundCommitted,
    backgroundError,
    applyBackground,
    clearBackground,
    textDraft,
    textCommitted,
    textError,
    applyText,
    clearText,
    mutedTextDraft,
    mutedTextCommitted,
    mutedTextError,
    applyMutedText,
    clearMutedText,
    patchSettings,
    patchPrivacy,
    commitButtonLabel,
  } = useSdkSetupWidgetSetting(projectId);

  const positionItems = useMemo(
    () => [
      { value: "bottom-right", label: texts.widgetSettings.position.bottomRight },
      { value: "bottom-left", label: texts.widgetSettings.position.bottomLeft },
    ],
    [],
  );

  const themeItems = useMemo(
    () => [
      { value: "auto", label: texts.widgetSettings.theme.auto },
      { value: "light", label: texts.widgetSettings.theme.light },
      { value: "dark", label: texts.widgetSettings.theme.dark },
    ],
    [],
  );

  const fontItems = useMemo(
    () =>
      projectWidgetSettingFontValues.map((value) => ({
        value,
        label:
          value === "default"
            ? texts.widgetSettings.font.default
            : value === "system-ui"
              ? texts.widgetSettings.font.systemUi
              : value === "georgia"
                ? texts.widgetSettings.font.georgia
                : texts.widgetSettings.font.monospace,
      })),
    [],
  );

  return (
    <Panel>
      <Panel.Header title={texts.widgetSettings.title} description={texts.widgetSettings.description} />
      <Panel.Content gap="lg">
        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.position.label}
          control={
            <SegmentedControl
              aria-label={texts.widgetSettings.position.label}
              value={settings.position}
              items={positionItems}
              onValueChange={(value) => patchSettings({ position: value as ProjectWidgetSettingModelType["position"] })}
            />
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.buttonLabel.label}
          htmlFor="widget-button-label"
          invalid={buttonLabelError !== null}
          labelAccessory={
            buttonLabelError ? (
              <Badge variant="destructive">
                <InfoIcon />
                {buttonLabelError}
              </Badge>
            ) : undefined
          }
          control={
            <Input
              id="widget-button-label"
              value={buttonLabelDraft}
              aria-invalid={buttonLabelError !== null}
              onChange={(event) => setButtonLabelDraft(event.target.value)}
              onBlur={commitButtonLabel}
            />
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.theme.label}
          control={
            <SegmentedControl
              aria-label={texts.widgetSettings.theme.label}
              value={settings.theme}
              items={themeItems}
              onValueChange={(value) => patchSettings({ theme: value as ProjectWidgetSettingModelType["theme"] })}
            />
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.accent.label}
          control={
            <Row gap="sm" wrap={false}>
              {projectWidgetSettingAccentValues.map((accent) => (
                <ColorSwatchButton
                  key={accent}
                  color={accent}
                  selected={settings.accent === accent}
                  label={texts.widgetSettings.accent.swatchLabel(accent)}
                  onClick={() => patchSettings({ accent })}
                />
              ))}
            </Row>
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.background.label}
          htmlFor="widget-background"
          invalid={backgroundError !== null}
          labelAccessory={
            backgroundError ? (
              <Badge variant="destructive">
                <InfoIcon />
                {backgroundError}
              </Badge>
            ) : undefined
          }
          control={
            <SdkSetupWidgetColorPicker
              id="widget-background"
              label={texts.widgetSettings.background.label}
              draft={backgroundDraft}
              committed={backgroundCommitted}
              invalid={backgroundError !== null}
              onPick={applyBackground}
              onClear={clearBackground}
            />
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.text.label}
          htmlFor="widget-text"
          invalid={textError !== null}
          labelAccessory={
            textError ? (
              <Badge variant="destructive">
                <InfoIcon />
                {textError}
              </Badge>
            ) : undefined
          }
          control={
            <SdkSetupWidgetColorPicker
              id="widget-text"
              label={texts.widgetSettings.text.label}
              draft={textDraft}
              committed={textCommitted}
              invalid={textError !== null}
              onPick={applyText}
              onClear={clearText}
            />
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.mutedText.label}
          htmlFor="widget-muted-text"
          invalid={mutedTextError !== null}
          labelAccessory={
            mutedTextError ? (
              <Badge variant="destructive">
                <InfoIcon />
                {mutedTextError}
              </Badge>
            ) : undefined
          }
          control={
            <SdkSetupWidgetColorPicker
              id="widget-muted-text"
              label={texts.widgetSettings.mutedText.label}
              draft={mutedTextDraft}
              committed={mutedTextCommitted}
              invalid={mutedTextError !== null}
              onPick={applyMutedText}
              onClear={clearMutedText}
            />
          }
        />

        <SdkSetupWidgetSettingField
          label={texts.widgetSettings.font.label}
          control={
            <SegmentedControl
              aria-label={texts.widgetSettings.font.label}
              value={settings.font ?? "default"}
              items={fontItems}
              onValueChange={(value) => patchSettings({ font: value as ProjectWidgetSettingModelType["font"] })}
            />
          }
        />

        <SdkSetupWidgetSettingField
          htmlFor="widget-allowed-domains"
          label={texts.widgetSettings.allowedDomains.label}
          description={texts.widgetSettings.allowedDomains.description}
          control={
            <TagsInput
              id="widget-allowed-domains"
              value={settings.allowedDomains}
              onValueChange={(allowedDomains) => patchSettings({ allowedDomains })}
              placeholder={texts.widgetSettings.allowedDomains.placeholder}
              removeTagLabel={texts.widgetSettings.allowedDomains.removeTag}
            />
          }
        />

        <Column gap="md">
          <Typography variant="heading-xs">{texts.widgetSettings.privacy.heading}</Typography>

          <SdkSetupWidgetSettingField
            orientation="horizontal"
            htmlFor="privacy-mask-text"
            label={texts.widgetSettings.privacy.maskText.label}
            description={texts.widgetSettings.privacy.maskText.description}
            control={
              <Switch
                id="privacy-mask-text"
                checked={settings.privacy.maskText}
                onCheckedChange={(maskText) => patchPrivacy({ maskText })}
              />
            }
          />

          <SdkSetupWidgetSettingField
            orientation="horizontal"
            htmlFor="privacy-mask-inputs"
            label={texts.widgetSettings.privacy.maskInputs.label}
            description={texts.widgetSettings.privacy.maskInputs.description}
            control={
              <Switch
                id="privacy-mask-inputs"
                checked={settings.privacy.maskInputs}
                onCheckedChange={(maskInputs) => patchPrivacy({ maskInputs })}
              />
            }
          />

          <SdkSetupWidgetSettingField
            htmlFor="privacy-block-selectors"
            label={texts.widgetSettings.privacy.blockSelectors.label}
            description={texts.widgetSettings.privacy.blockSelectors.description}
            control={
              <TagsInput
                id="privacy-block-selectors"
                value={settings.privacy.blockSelectors}
                onValueChange={(blockSelectors) => patchPrivacy({ blockSelectors })}
                placeholder={texts.widgetSettings.privacy.blockSelectors.placeholder}
                removeTagLabel={texts.widgetSettings.privacy.blockSelectors.removeTag}
              />
            }
          />
        </Column>

        {/* TODO: Capture toggles (screenshot, replay, console, network) */}
      </Panel.Content>
    </Panel>
  );
}

function SdkSetupWidgetSettingsCardFallback() {
  return <Skeleton className="h-170" />;
}

SdkSetupWidgetSettingsCard.Fallback = SdkSetupWidgetSettingsCardFallback;
