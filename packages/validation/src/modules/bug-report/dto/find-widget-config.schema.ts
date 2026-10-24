import { projectWidgetSettingModelSchema } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { z } from "zod";

export const findWidgetConfigInputDtoSchema = z.object({
  apiKey: z.string().min(1),
});

export type FindWidgetConfigInputDtoType = z.infer<typeof findWidgetConfigInputDtoSchema>;

export const findWidgetConfigOutputDtoSchema = projectWidgetSettingModelSchema.omit({ allowedDomains: true });

export type FindWidgetConfigOutputDtoType = z.infer<typeof findWidgetConfigOutputDtoSchema>;
