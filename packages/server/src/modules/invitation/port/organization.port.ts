import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";

export type OrganizationPort = {
  findById: (organizationId: string) => Promise<OrganizationModelType | null>;
};
