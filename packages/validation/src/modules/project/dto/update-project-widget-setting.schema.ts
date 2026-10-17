import { projectWidgetSettingModelSchema } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { z } from "zod";

export const updateProjectWidgetSettingInputDtoSchema = z.object({
  projectId: z.uuid(),
  settings: projectWidgetSettingModelSchema,
});

export type UpdateProjectWidgetSettingInputDtoType = z.infer<typeof updateProjectWidgetSettingInputDtoSchema>;

export const updateProjectWidgetSettingOutputDtoSchema = projectWidgetSettingModelSchema;

export type UpdateProjectWidgetSettingOutputDtoType = z.infer<typeof updateProjectWidgetSettingOutputDtoSchema>;
