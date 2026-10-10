import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";

export class OrganizationAdapter implements OrganizationPort {
  constructor(private readonly organizationRepository: OrganizationRepository = new OrganizationRepository()) {}

  async findNameById(organizationId: string): Promise<string | null> {
    const organization = await this.organizationRepository.findById(organizationId);
    return organization ? OrganizationMapper.toDto(organization).name : null;
  }
}
