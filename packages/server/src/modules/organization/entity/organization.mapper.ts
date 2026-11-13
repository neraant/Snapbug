import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import type { OrganizationPersistedType } from "@workspace/server/modules/organization/entity/organization.types";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import type { CreateOrganizationOutputDtoType } from "@workspace/validation/modules/organization/dto/create-organization.schema";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import type { FindOrganizationsOutputDtoType } from "@workspace/validation/modules/organization/dto/find-organizations.schema";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

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

  static toFindOrganizationsOutput(
    memberships: MembershipModelType[],
    organizations: Organization[],
  ): FindOrganizationsOutputDtoType {
    const organizationById = new Map(organizations.map((organization) => [organization.id, organization]));

    return memberships.flatMap((membership) => {
      const organization = organizationById.get(membership.organizationId);
      if (!organization) return [];

      return [
        {
          organizationId: organization.id,
          name: organization.name,
          reports_retention_days: organization.reports_retention_days,
          role: membership.role,
        },
      ];
    });
  }

  static toCreateOrganizationOutput(
    organization: Organization,
    project: ProjectModelType,
  ): CreateOrganizationOutputDtoType {
    return { organization: OrganizationMapper.toDto(organization), project };
  }

  static toFindOnboardingOutput(input: {
    completedAt: Date | null;
    suggestedOrganizationName: string;
    organization: Organization | null;
    project: ProjectModelType | null;
  }): FindOnboardingOutputDtoType {
    return {
      completedAt: input.completedAt,
      suggestedOrganizationName: input.suggestedOrganizationName,
      organizationId: input.organization?.id ?? null,
      organizationName: input.organization?.name ?? null,
      projectId: input.project?.id ?? null,
      projectName: input.project?.name ?? null,
    };
  }
}
