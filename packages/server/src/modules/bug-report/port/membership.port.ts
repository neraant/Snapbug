import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export type MembershipPort = {
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  findManyByOrganizationId: (organizationId: string) => Promise<MembershipModelType[]>;
  findManyByUser: (userId: string) => Promise<MembershipModelType[]>;
  filterProjectIds: (membership: Pick<MembershipModelType, "id" | "role">, projectIds: string[]) => Promise<string[]>;
};
