import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export type MembershipPort = {
  findManyByUser: (userId: string) => Promise<MembershipModelType[]>;
  filterProjectIds: (membership: Pick<MembershipModelType, "id" | "role">, projectIds: string[]) => Promise<string[]>;
};
