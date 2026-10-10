import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";

export type MembershipPort = {
  withTx: (tx: unknown) => MembershipPort;
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  findByUser: (userId: string) => Promise<FindMembershipByUserOutputDtoType>;
  create: (input: CreateMembershipInputDtoType, userId: string) => Promise<CreateMembershipOutputDtoType>;
};
