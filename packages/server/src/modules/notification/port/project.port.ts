import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export type NotificationProjectPort = {
  findById(id: string): Promise<ProjectModelType | null>;
  findManyByOrganizationId(input: { organizationId: string }): Promise<ProjectModelType[]>;
};