import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export type MembershipPort = {
  withTx: (tx: unknown) => MembershipPort;
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  createInvited: (organizationId: string, userId: string) => Promise<MembershipModelType>;
  grantProjects: (membershipId: string, projectIds: string[], userId: string) => Promise<void>;
};
