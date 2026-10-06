import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { CreateMembershipType } from "@workspace/server/modules/membership/entity/membership.types";
import { randomUUID } from "crypto";

export abstract class MembershipFactory {
  static create(membership: CreateMembershipType): Membership {
    return new Membership({
      id: randomUUID(),
      userId: membership.userId,
      organizationId: membership.organizationId,
      role: membership.role,
      createdAt: new Date(),
    });
  }
}
