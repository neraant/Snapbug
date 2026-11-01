import type { MembershipPersistedType } from "@workspace/server/modules/membership/entity/membership.types";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

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

  changeRole(role: UserRole): Membership {
    if (role === this.role) {
      return this;
    }

    return new Membership({ ...this.toObject(), role });
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
