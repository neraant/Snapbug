import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export type MembershipPersistedType = {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: Date;
};

export type CreateMembershipType = Pick<MembershipPersistedType, "userId" | "organizationId" | "role">;
