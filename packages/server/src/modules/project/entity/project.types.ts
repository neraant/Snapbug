import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import type { ProjectColor } from "@workspace/validation/shared/project-color.schema";

export type ProjectPersistedType = {
  id: string;
  name: string;
  color: ProjectColor;
  organizationId: string;
  widgetSettings: ProjectWidgetSettingModelType | null;
  createdAt: Date;
};

export type CreateProjectType = Pick<ProjectPersistedType, "name" | "color" | "organizationId">;

export type UpdateProjectType = Partial<Pick<ProjectPersistedType, "name" | "widgetSettings">>;
