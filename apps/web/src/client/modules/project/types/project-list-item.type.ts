import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export type ProjectListItem = ProjectModelType & {
  openCount: number;
};
