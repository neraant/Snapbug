import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import type { CreateOrganizationType } from "@workspace/server/modules/organization/entity/organization.types";
import { randomUUID } from "crypto";

const DEFAULT_REPORTS_RETENTION_DAYS = 90;

export abstract class OrganizationFactory {
  static create(organization: CreateOrganizationType): Organization {
    return new Organization({
      id: randomUUID(),
      name: organization.name,
      reports_retention_days: organization.reports_retention_days ?? DEFAULT_REPORTS_RETENTION_DAYS,
      createdAt: new Date(),
    });
  }
}
