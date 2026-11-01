import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export type MembershipPort = {
  withTx: (tx: unknown) => MembershipPort;
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  findManyByUser: (userId: string) => Promise<MembershipModelType[]>;
  create: (input: CreateMembershipInputDtoType, userId: string) => Promise<CreateMembershipOutputDtoType>;
};
