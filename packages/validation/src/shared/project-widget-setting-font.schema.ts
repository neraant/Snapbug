import { z } from "zod";

export const projectWidgetSettingFontValues = ["default", "system-ui", "georgia", "monospace"] as const;

export const projectWidgetSettingFontSchema = z.enum(projectWidgetSettingFontValues);

export type ProjectWidgetSettingFontType = z.infer<typeof projectWidgetSettingFontSchema>;
