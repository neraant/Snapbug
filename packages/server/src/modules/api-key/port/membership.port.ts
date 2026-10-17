import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";

export type MembershipPort = {
  findByUser: (userId: string) => Promise<FindMembershipByUserOutputDtoType>;
};
