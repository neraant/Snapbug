import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";

export type MembershipPort = {
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  findByUser: (userId: string) => Promise<FindMembershipByUserOutputDtoType>;
};
