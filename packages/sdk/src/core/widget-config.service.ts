import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { widgetHexColorSchema } from "@workspace/validation/shared/widget-hex-color.schema";

import { WIDGET_ACCENTS, WIDGET_FONTS, WIDGET_POSITIONS, WIDGET_THEMES } from "./widget-config.const";
import type { RemoteWidgetConfig, ResolvedWidgetOptions, WidgetConfig } from "./widget-config.types";
import { widgetConfigEndpoint } from "./widget-endpoint.util";

export function resolveWidgetOptions(config: WidgetConfig): ResolvedWidgetOptions {
  const defaults = projectWidgetSettingModelDefaults;

  const position =
    typeof config.position === "string" && WIDGET_POSITIONS.has(config.position) ? config.position : defaults.position;

  const trimmedLabel = typeof config.buttonLabel === "string" ? config.buttonLabel.trim() : "";
  const buttonLabel = trimmedLabel.length > 0 ? trimmedLabel : defaults.buttonLabel;

  const theme = typeof config.theme === "string" && WIDGET_THEMES.has(config.theme) ? config.theme : defaults.theme;

  const accent =
    typeof config.accent === "string" && WIDGET_ACCENTS.has(config.accent) ? config.accent : defaults.accent;

  const background = resolveOptionalHex(config.background);
  const text = resolveOptionalHex(config.text);
  const mutedText = resolveOptionalHex(config.mutedText);

  const font =
    typeof config.font === "string" && WIDGET_FONTS.has(config.font as NonNullable<typeof config.font>)
      ? config.font
      : undefined;

  return { position, buttonLabel, theme, accent, background, text, mutedText, font, privacy: resolvePrivacy(config) };
}

export async function fetchRemoteWidgetConfig(apiHost: string, apiKey: string): Promise<RemoteWidgetConfig | null> {
  try {
    const response = await fetch(widgetConfigEndpoint(apiHost, apiKey));
    if (!response.ok) return null;

    const body = (await response.json()) as RemoteWidgetConfig;
    return body;
  } catch {
    return null;
  }
}

export function mergeWidgetConfig(init: WidgetConfig, remote: RemoteWidgetConfig | null): WidgetConfig {
  if (!remote) return init;

  return {
    ...init,
    position: init.position ?? remote.position,
    buttonLabel: init.buttonLabel ?? remote.buttonLabel,
    theme: init.theme ?? remote.theme,
    accent: init.accent ?? remote.accent,
    background: init.background ?? remote.background,
    text: init.text ?? remote.text,
    mutedText: init.mutedText ?? remote.mutedText,
    font: init.font ?? remote.font,
    privacy: init.privacy ?? remote.privacy,
  };
}

function resolveOptionalHex(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const result = widgetHexColorSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

function resolvePrivacy(config: WidgetConfig): ProjectWidgetSettingModelType["privacy"] {
  const privacyInput = config.privacy;
  const privacyDefaults = projectWidgetSettingModelDefaults.privacy;
  return {
    maskText: typeof privacyInput?.maskText === "boolean" ? privacyInput.maskText : privacyDefaults.maskText,
    maskInputs: typeof privacyInput?.maskInputs === "boolean" ? privacyInput.maskInputs : privacyDefaults.maskInputs,
    blockSelectors: Array.isArray(privacyInput?.blockSelectors)
      ? privacyInput.blockSelectors
      : privacyDefaults.blockSelectors,
  };
}
