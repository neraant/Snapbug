import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

export type ProjectPort = {
  findManyByOrganizationId: (input: FindProjectsInputDtoType) => Promise<FindProjectsOutputDtoType>;
  findById: (id: string) => Promise<ProjectModelType | null>;
  findWidgetSetting: (projectId: string) => Promise<ProjectWidgetSettingModelType | null>;
};
