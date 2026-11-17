import type { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";

export class NotificationMembershipAdapter implements NotificationMembershipPort {
  constructor(private readonly membershipAdapter: MembershipAdapter) {}

  async findManyByOrganizationId(organizationId: string) {
    return await this.membershipAdapter.findManyByOrganizationId(organizationId);
  }

  async filterProjectIds(
    membership: Parameters<NotificationMembershipPort["filterProjectIds"]>[0],
    projectIds: string[],
  ) {
    return await this.membershipAdapter.filterProjectIds(membership, projectIds);
  }
}