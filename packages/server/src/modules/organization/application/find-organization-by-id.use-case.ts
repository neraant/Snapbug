import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";

export class FindOrganizationByIdUseCase {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async execute(id: string): Promise<OrganizationModelType | null> {
    const organization = await this.organizationRepository.findById(id);
    return organization ? OrganizationMapper.toDto(organization) : null;
  }
}
