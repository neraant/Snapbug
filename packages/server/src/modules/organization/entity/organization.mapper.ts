import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import type { OrganizationPersistedType } from "@workspace/server/modules/organization/entity/organization.types";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";

export abstract class OrganizationMapper {
  static fromPersistence(row: OrganizationPersistedType): Organization {
    return new Organization(row);
  }

  static toPersistence(organization: Organization): OrganizationPersistedType {
    return organization.toObject();
  }

  static toDto(organization: Organization): OrganizationModelType {
    const { id, name, reports_retention_days, createdAt } = organization.toObject();
    return { id, name, reports_retention_days, createdAt: createdAt.toISOString() };
  }
}
