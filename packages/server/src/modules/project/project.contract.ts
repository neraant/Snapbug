import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { createProjectInputDtoSchema } from "@workspace/validation/modules/project/dto/create-project.schema";
import {
  findProjectWidgetSettingInputDtoSchema,
  findProjectWidgetSettingOutputDtoSchema,
} from "@workspace/validation/modules/project/dto/find-project-widget-setting.schema";
import { findProjectsOutputDtoSchema } from "@workspace/validation/modules/project/dto/find-projects.schema";
import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import {
  archiveProjectInputDtoSchema,
  deleteProjectInputDtoSchema,
  restoreProjectInputDtoSchema,
  updateProjectInputDtoSchema,
} from "@workspace/validation/modules/project/dto/update-project.schema";
import {
  updateProjectWidgetSettingInputDtoSchema,
  updateProjectWidgetSettingOutputDtoSchema,
} from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";
import { z } from "zod";

export const projectContract = {
  createProject: oc
    .input(createProjectInputDtoSchema)
    .output(projectModelSchema)
    .route({
      method: "POST",
      path: "/projects",
      tags: ["project"],
      summary: "Create project",
      spec: sessionAuthSpec,
    }),
  findProjects: oc
    .output(findProjectsOutputDtoSchema)
    .route({ method: "GET", path: "/projects", tags: ["project"], summary: "List projects", spec: sessionAuthSpec }),
  updateProject: oc
    .input(updateProjectInputDtoSchema)
    .output(projectModelSchema)
    .route({
      method: "PATCH",
      path: "/projects",
      tags: ["project"],
      summary: "Update project",
      spec: sessionAuthSpec,
    }),
  archiveProject: oc
    .input(archiveProjectInputDtoSchema)
    .output(projectModelSchema)
    .route({
      method: "POST",
      path: "/projects/archive",
      tags: ["project"],
      summary: "Archive project",
      spec: sessionAuthSpec,
    }),
  restoreProject: oc
    .input(restoreProjectInputDtoSchema)
    .output(projectModelSchema)
    .route({
      method: "POST",
      path: "/projects/restore",
      tags: ["project"],
      summary: "Restore project",
      spec: sessionAuthSpec,
    }),
  deleteProject: oc
    .input(deleteProjectInputDtoSchema)
    .output(z.void())
    .route({
      method: "DELETE",
      path: "/projects",
      tags: ["project"],
      summary: "Delete project",
      spec: sessionAuthSpec,
    }),
  findProjectWidgetSetting: oc
    .input(findProjectWidgetSettingInputDtoSchema)
    .output(findProjectWidgetSettingOutputDtoSchema)
    .route({
      method: "GET",
      path: "/projects/widget-setting",
      tags: ["project"],
      summary: "Find project widget settings",
      spec: sessionAuthSpec,
    }),
  updateProjectWidgetSetting: oc
    .input(updateProjectWidgetSettingInputDtoSchema)
    .output(updateProjectWidgetSettingOutputDtoSchema)
    .route({
      method: "PATCH",
      path: "/projects/widget-setting",
      tags: ["project"],
      summary: "Update project widget settings",
      spec: sessionAuthSpec,
    }),
};
