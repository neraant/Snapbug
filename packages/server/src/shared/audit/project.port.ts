import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export type AuditProjectPort = {
  findById: (id: string) => Promise<ProjectModelType | null>;
  withTx: (tx: unknown) => AuditProjectPort;
};
