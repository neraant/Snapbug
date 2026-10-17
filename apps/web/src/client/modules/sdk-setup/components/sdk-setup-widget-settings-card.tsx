import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { ColorSwatchButton } from "@workspace/design-system/components/ui/color-swatch-button";
import { Input } from "@workspace/design-system/components/ui/input";
import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Switch } from "@workspace/design-system/components/ui/switch";
import { TagsInput } from "@workspace/design-system/components/ui/tags-input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import {
  projectWidgetSettingAccentValues,
  type ProjectWidgetSettingModelType,
} from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { InfoIcon } from "lucide-react";
import { useMemo } from "react";

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

  return (
    <MetricCard>
      <MetricCard.Header title={texts.widgetSettings.title} description={texts.widgetSettings.description} />
      <MetricCard.Content gap="lg">
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

        {/* TODO: Capture toggles (screenshot, replay, console, network) and allowed domains */}
      </MetricCard.Content>
    </MetricCard>
  );
}

function SdkSetupWidgetSettingsCardFallback() {
  return <Skeleton className="h-120 w-full" />;
}

SdkSetupWidgetSettingsCard.Fallback = SdkSetupWidgetSettingsCardFallback;
