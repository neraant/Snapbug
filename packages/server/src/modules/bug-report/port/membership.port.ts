import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export type MembershipPort = {
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
};
