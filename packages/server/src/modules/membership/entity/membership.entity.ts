import type { MembershipPersistedType } from "@workspace/server/modules/membership/entity/membership.types";

export class Membership {
  readonly id: MembershipPersistedType["id"];
  readonly userId: MembershipPersistedType["userId"];
  readonly organizationId: MembershipPersistedType["organizationId"];
  readonly role: MembershipPersistedType["role"];
  readonly createdAt: MembershipPersistedType["createdAt"];

  constructor(membership: MembershipPersistedType) {
    this.id = membership.id;
    this.userId = membership.userId;
    this.organizationId = membership.organizationId;
    this.role = membership.role;
    this.createdAt = membership.createdAt;
  }

  toObject(): MembershipPersistedType {
    return {
      id: this.id,
      userId: this.userId,
      organizationId: this.organizationId,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
