import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { ProjectPersistedType } from "@workspace/server/modules/project/entity/project.types";
import type { FindProjectsOutputDtoType } from "@workspace/validation/modules/project/dto/find-projects.schema";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import {
  projectWidgetSettingModelDefaults,
  projectWidgetSettingModelSchema,
  type ProjectWidgetSettingModelType,
} from "@workspace/validation/modules/project/dto/project-widget-setting.model";

export abstract class ProjectMapper {
  static fromPersistence(row: ProjectPersistedType): Project {
    return new Project(row);
  }

  static toPersistence(project: Project): ProjectPersistedType {
    return project.toObject();
  }

  static toAudit(project: Project): Record<string, unknown> {
    const { name, color, organizationId, widgetSettings } = project.toObject();
    return { name, color, organizationId, widgetSettings };
  }

  static toDto(project: Project): ProjectModelType {
    const { id, name, color, organizationId, createdAt } = project.toObject();
    return { id, name, color, organizationId, createdAt: createdAt.toISOString() };
  }

  static toFindProjectsOutput(projects: Project[]): FindProjectsOutputDtoType {
    return projects.map((project) => ProjectMapper.toDto(project));
  }

  static toWidgetSettingDto(project: Project): ProjectWidgetSettingModelType {
    const { widgetSettings } = project.toObject();
    if (!widgetSettings) {
      return projectWidgetSettingModelDefaults;
    }

    return projectWidgetSettingModelSchema.parse({
      ...projectWidgetSettingModelDefaults,
      ...widgetSettings,
      privacy: {
        ...projectWidgetSettingModelDefaults.privacy,
        ...widgetSettings.privacy,
      },
      allowedDomains: widgetSettings.allowedDomains ?? projectWidgetSettingModelDefaults.allowedDomains,
    });
  }
}
