import { z } from "zod";

export const projectWidgetSettingAccentValues = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6"] as const;

export const projectWidgetSettingPrivacyModelSchema = z.object({
  maskText: z.boolean(),
  maskInputs: z.boolean(),
  blockSelectors: z.array(z.string()),
});

export const projectWidgetSettingModelSchema = z
  .object({
    position: z.enum(["bottom-right", "bottom-left"]),
    buttonLabel: z.string().trim().min(1),
    theme: z.enum(["auto", "light", "dark"]),
    accent: z.enum(projectWidgetSettingAccentValues),
    privacy: projectWidgetSettingPrivacyModelSchema,
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
};
