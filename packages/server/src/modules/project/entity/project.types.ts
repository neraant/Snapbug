import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import type { ProjectColor } from "@workspace/validation/shared/project-color.schema";

export type ProjectPersistedType = {
  id: string;
  name: string;
  slug: string;
  color: ProjectColor;
  organizationId: string;
  defaultAssigneeId: string | null;
  storeVisitorIp: boolean;
  collectVisitorEmail: boolean;
  archivedAt: Date | null;
  widgetSettings: ProjectWidgetSettingModelType | null;
  createdAt: Date;
};

export type CreateProjectType = Pick<ProjectPersistedType, "name" | "color" | "organizationId" | "slug">;

export type UpdateProjectType = Partial<
  Pick<
    ProjectPersistedType,
    | "name"
    | "slug"
    | "color"
    | "defaultAssigneeId"
    | "storeVisitorIp"
    | "collectVisitorEmail"
    | "archivedAt"
    | "widgetSettings"
  >
>;
