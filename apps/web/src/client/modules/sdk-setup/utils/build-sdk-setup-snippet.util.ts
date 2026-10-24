import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import {
  sdkSetupCdnScriptUrl,
  sdkSetupNpmPackageName,
} from "@/client/modules/sdk-setup/consts/sdk-setup-package.const";
import {
  buildSnapbugWidgetInitOptions,
  type SnapbugWidgetInitOptions,
} from "@/client/modules/sdk-setup/utils/build-snapbug-widget-init-options.util";

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

function formatStringLiteral(value: string): string {
  return `'${escapeSingleQuoted(value)}'`;
}

function formatWidgetInitOptionLines(options: SnapbugWidgetInitOptions, propertyIndent: string): string[] {
  const lines: string[] = [];

  if (options.position !== undefined) {
    lines.push(`${propertyIndent}position: ${formatStringLiteral(options.position)},`);
  }
  if (options.buttonLabel !== undefined) {
    lines.push(`${propertyIndent}buttonLabel: ${formatStringLiteral(options.buttonLabel)},`);
  }
  if (options.theme !== undefined) {
    lines.push(`${propertyIndent}theme: ${formatStringLiteral(options.theme)},`);
  }
  if (options.accent !== undefined) {
    lines.push(`${propertyIndent}accent: ${formatStringLiteral(options.accent)},`);
  }
  if (options.background !== undefined) {
    lines.push(`${propertyIndent}background: ${formatStringLiteral(options.background)},`);
  }
  if (options.text !== undefined) {
    lines.push(`${propertyIndent}text: ${formatStringLiteral(options.text)},`);
  }
  if (options.mutedText !== undefined) {
    lines.push(`${propertyIndent}mutedText: ${formatStringLiteral(options.mutedText)},`);
  }
  if (options.font !== undefined) {
    lines.push(`${propertyIndent}font: ${formatStringLiteral(options.font)},`);
  }
  if (options.privacy !== undefined) {
    const privacyIndent = `${propertyIndent}  `;
    const privacyLines: string[] = [`${propertyIndent}privacy: {`];
    if (options.privacy.maskText !== undefined) {
      privacyLines.push(`${privacyIndent}maskText: ${options.privacy.maskText},`);
    }
    if (options.privacy.maskInputs !== undefined) {
      privacyLines.push(`${privacyIndent}maskInputs: ${options.privacy.maskInputs},`);
    }
    if (options.privacy.blockSelectors !== undefined) {
      privacyLines.push(
        `${privacyIndent}blockSelectors: [${options.privacy.blockSelectors.map((selector) => formatStringLiteral(selector)).join(", ")}],`,
      );
    }
    privacyLines.push(`${propertyIndent}},`);
    lines.push(...privacyLines);
  }

  return lines;
}

function buildInitConfigObject(
  apiKey: string,
  host: string,
  widgetOptions: SnapbugWidgetInitOptions,
  baseIndent: string,
): string {
  const propertyIndent = `${baseIndent}  `;
  const optionLines = formatWidgetInitOptionLines(widgetOptions, propertyIndent);
  const lines = [
    `${baseIndent}{`,
    `${propertyIndent}apiKey: ${formatStringLiteral(apiKey)},`,
    `${propertyIndent}host: ${formatStringLiteral(host)},`,
    ...optionLines,
    `${baseIndent}}`,
  ];
  return lines.join("\n");
}

export function buildSdkSetupInitSnippet(input: {
  tab: SdkSetupInitTab;
  apiKey: string;
  revealKey: boolean;
  hostExample?: string;
  widgetSettings?: ProjectWidgetSettingModelType;
}): string {
  const displayKey = input.revealKey ? input.apiKey : maskApiKey(input.apiKey);
  const host = input.hostExample ?? "https://your-app.com";
  const widgetOptions = input.widgetSettings ? buildSnapbugWidgetInitOptions(input.widgetSettings) : {};
  const initConfigIndent = "    ";
  const configObject = buildInitConfigObject(displayKey, host, widgetOptions, initConfigIndent);

  if (input.tab === "next") {
    return `'use client';

import { useEffect } from 'react';
import { snapbug } from '@neraant/snapbug';

export function SnapbugProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    snapbug.init(${configObject});

    return () => snapbug.destroy();
  }, []);

  return <>{children}</>;
}`;
  }

  return `import { useEffect } from 'react';
import { snapbug } from '@neraant/snapbug';

export function App() {
  useEffect(() => {
    snapbug.init(${configObject});

    return () => snapbug.destroy();
  }, []);

  return <YourApplicationRoot />;
}`;
}

export function buildSdkSetupInitSnippetForCopy(input: {
  tab: SdkSetupInitTab;
  apiKey: string;
  hostExample?: string;
  widgetSettings?: ProjectWidgetSettingModelType;
}): string {
  return buildSdkSetupInitSnippet({ ...input, revealKey: true });
}
