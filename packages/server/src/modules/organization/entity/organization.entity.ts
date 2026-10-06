import type {
  OrganizationPersistedType,
  UpdateOrganizationType,
} from "@workspace/server/modules/organization/entity/organization.types";

export class Organization {
  readonly id: OrganizationPersistedType["id"];
  readonly name: OrganizationPersistedType["name"];
  readonly reports_retention_days: OrganizationPersistedType["reports_retention_days"];
  readonly createdAt: OrganizationPersistedType["createdAt"];

  constructor(organization: OrganizationPersistedType) {
    this.id = organization.id;
    this.name = organization.name;
    this.reports_retention_days = organization.reports_retention_days;
    this.createdAt = organization.createdAt;
  }

  update(patch: UpdateOrganizationType): Organization {
    return new Organization({
      ...this.toObject(),
      ...patch,
      id: this.id,
      createdAt: this.createdAt,
    });
  }

  toObject(): OrganizationPersistedType {
    return {
      id: this.id,
      name: this.name,
      reports_retention_days: this.reports_retention_days,
      createdAt: this.createdAt,
    };
  }
}
