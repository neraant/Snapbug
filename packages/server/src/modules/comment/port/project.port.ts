import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export type ProjectPort = {
  findById: (id: string) => Promise<ProjectModelType | null>;
};
