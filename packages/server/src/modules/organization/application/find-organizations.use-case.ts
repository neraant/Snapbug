import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { FindOrganizationsOutputDtoType } from "@workspace/validation/modules/organization/dto/find-organizations.schema";

export class FindOrganizationsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(userId: string): Promise<FindOrganizationsOutputDtoType> {
    const memberships = await this.membershipPort.findManyByUser(userId);
    if (memberships.length === 0) return [];

    const organizations = await this.organizationRepository.findManyByIds(
      memberships.map((membership) => membership.organizationId),
    );
    return OrganizationMapper.toFindOrganizationsOutput(memberships, organizations);
  }
}
