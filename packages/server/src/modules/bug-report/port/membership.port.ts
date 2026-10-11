import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export type MembershipPort = {
  findByUser: (userId: string) => Promise<FindMembershipByUserOutputDtoType>;
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  findManyByOrganizationId: (organizationId: string) => Promise<MembershipModelType[]>;
};
