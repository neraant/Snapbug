import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export type AuditMembershipLinkType = {
  id: string;
};

export type MembershipPort = {
  findByUserAndOrganization: (input: FindMembershipInputDtoType) => Promise<FindMembershipOutputDtoType>;
  findManyByIds: (ids: string[]) => Promise<AuditMembershipLinkType[]>;
};
