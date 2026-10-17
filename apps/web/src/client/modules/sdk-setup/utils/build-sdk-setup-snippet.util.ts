import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import {
  sdkSetupCdnScriptUrl,
  sdkSetupNpmPackageName,
} from "@/client/modules/sdk-setup/consts/sdk-setup-package.const";

export type SdkSetupInstallTab = "npm" | "pnpm" | "yarn" | "script";

export type SdkSetupInitTab = "react" | "next";

export function buildSdkSetupInstallSnippet(tab: SdkSetupInstallTab, apiKey: string): string {
  switch (tab) {
    case "npm":
      return `npm install ${sdkSetupNpmPackageName}`;
    case "pnpm":
      return `pnpm add ${sdkSetupNpmPackageName}`;
    case "yarn":
      return `yarn add ${sdkSetupNpmPackageName}`;
    case "script":
      return `<script 
  src="${sdkSetupCdnScriptUrl}" 
  data-api-key="${apiKey}"
  async>
</script>`;
  }
}

function maskApiKey(apiKey: string): string {
  return apiKey.replace(/.(?=.{4})/g, "•");
}

function escapeSingleQuoted(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function buildInitConfigObject(apiKey: string, host: string, widgetSettings: ProjectWidgetSettingModelType): string {
  const selectors = widgetSettings.privacy.blockSelectors
    .map((selector) => `'${escapeSingleQuoted(selector)}'`)
    .join(", ");

  return `{
    apiKey: '${escapeSingleQuoted(apiKey)}',
    host: '${escapeSingleQuoted(host)}',
    position: '${widgetSettings.position}',
    buttonLabel: '${escapeSingleQuoted(widgetSettings.buttonLabel)}',
    theme: '${widgetSettings.theme}',
    primaryColor: '${widgetSettings.accent}',
    privacy: {
      maskText: ${widgetSettings.privacy.maskText},
      maskInputs: ${widgetSettings.privacy.maskInputs},
      blockSelectors: [${selectors}],
    },
  }`;
}

export function buildSdkSetupInitSnippet(input: {
  tab: SdkSetupInitTab;
  apiKey: string;
  revealKey: boolean;
  hostExample?: string;
  widgetSettings: ProjectWidgetSettingModelType;
}): string {
  const displayKey = input.revealKey ? input.apiKey : maskApiKey(input.apiKey);
  const host = input.hostExample ?? "https://your-app.com";
  const configObject = buildInitConfigObject(displayKey, host, input.widgetSettings);

  if (input.tab === "next") {
    return `'use client';

import { useEffect } from 'react';
import { snapbug } from '@workspace/sdk';

export function SnapbugProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    snapbug.init(${configObject});
  }, []);

  return <>{children}</>;
}`;
  }

  return `import { useEffect } from 'react';
import { snapbug } from '@workspace/sdk';

export function App() {
  useEffect(() => {
    snapbug.init(${configObject});
  }, []);

  return <YourApplicationRoot />;
}`;
}

export function buildSdkSetupInitSnippetForCopy(input: {
  tab: SdkSetupInitTab;
  apiKey: string;
  hostExample?: string;
  widgetSettings: ProjectWidgetSettingModelType;
}): string {
  return buildSdkSetupInitSnippet({ ...input, revealKey: true });
}
