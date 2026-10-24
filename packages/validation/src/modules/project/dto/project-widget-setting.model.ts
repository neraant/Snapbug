import { projectWidgetSettingFontSchema } from "@workspace/validation/shared/project-widget-setting-font.schema";
import { widgetHexColorSchema } from "@workspace/validation/shared/widget-hex-color.schema";
import { z } from "zod";

export const projectWidgetSettingAccentValues = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6"] as const;

export const projectWidgetSettingPrivacyModelSchema = z.object({
  maskText: z.boolean(),
  maskInputs: z.boolean(),
  blockSelectors: z.array(z.string()),
});

export function normalizeAllowedDomainHost(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
  const protocolRelative = trimmed.startsWith("//");
  if (hasScheme || protocolRelative) {
    try {
      return new URL(trimmed).host.toLowerCase() || null;
    } catch {
      return null;
    }
  }

  if (trimmed.includes("/")) {
    try {
      return new URL(`https://${trimmed}`).host.toLowerCase() || null;
    } catch {
      return null;
    }
  }

  return trimmed.toLowerCase();
}

const allowedDomainsSchema = z
  .array(z.string())
  .default([])
  .transform((items) => {
    const seen = new Set<string>();
    const normalized: string[] = [];
    for (const item of items) {
      const host = normalizeAllowedDomainHost(item);
      if (host && !seen.has(host)) {
        seen.add(host);
        normalized.push(host);
      }
    }
    return normalized;
  });

export const projectWidgetSettingModelSchema = z
  .object({
    position: z.enum(["bottom-right", "bottom-left"]),
    buttonLabel: z.string().trim().min(1),
    theme: z.enum(["auto", "light", "dark"]),
    accent: z.enum(projectWidgetSettingAccentValues),
    background: widgetHexColorSchema.optional(),
    text: widgetHexColorSchema.optional(),
    mutedText: widgetHexColorSchema.optional(),
    font: projectWidgetSettingFontSchema.optional(),
    privacy: projectWidgetSettingPrivacyModelSchema,
    allowedDomains: allowedDomainsSchema,
  })
  .strict();

export type ProjectWidgetSettingModelType = z.infer<typeof projectWidgetSettingModelSchema>;

export const projectWidgetSettingModelDefaults: ProjectWidgetSettingModelType = {
  position: "bottom-right",
  buttonLabel: "Report a bug",
  theme: "auto",
  accent: "#F97316",
  privacy: {
    maskText: true,
    maskInputs: true,
    blockSelectors: [".credit-card-input", ".ssn-field", "[data-private]"],
  },
  allowedDomains: [],
};
