import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import { FindOrganizationByIdUseCase } from "@workspace/server/modules/organization/application/find-organization-by-id.use-case";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";

export class OrganizationAdapter implements OrganizationPort {
  private readonly findOrganizationById: FindOrganizationByIdUseCase;

  constructor(organizationRepository: OrganizationRepository) {
    this.findOrganizationById = new FindOrganizationByIdUseCase(organizationRepository);
  }

  async findById(organizationId: string): Promise<OrganizationModelType | null> {
    return await this.findOrganizationById.execute(organizationId);
  }
}
