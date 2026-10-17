import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

export type ProjectPersistedType = {
  id: string;
  name: string;
  organizationId: string;
  widgetSettings: ProjectWidgetSettingModelType | null;
  createdAt: Date;
};

export type CreateProjectType = Pick<ProjectPersistedType, "name" | "organizationId">;

export type UpdateProjectType = Partial<Pick<ProjectPersistedType, "name" | "widgetSettings">>;
