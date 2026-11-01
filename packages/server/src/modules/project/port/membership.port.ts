import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export type MembershipPort = {
  withTx: (tx: unknown) => MembershipPort;
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  filterProjectIds: (membership: Pick<MembershipModelType, "id" | "role">, projectIds: string[]) => Promise<string[]>;
  grantProjectToMembers: (organizationId: string, projectId: string, userId: string) => Promise<void>;
};
