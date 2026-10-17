import { projectWidgetSettingModelSchema } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { z } from "zod";

export const findProjectWidgetSettingInputDtoSchema = z.object({
  projectId: z.uuid(),
});

export type FindProjectWidgetSettingInputDtoType = z.infer<typeof findProjectWidgetSettingInputDtoSchema>;

export const findProjectWidgetSettingOutputDtoSchema = projectWidgetSettingModelSchema;

export type FindProjectWidgetSettingOutputDtoType = z.infer<typeof findProjectWidgetSettingOutputDtoSchema>;
