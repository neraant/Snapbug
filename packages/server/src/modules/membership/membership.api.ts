import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export async function findMembership(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
  const useCase = new FindMembershipUseCase(new MembershipRepository());
  return await useCase.execute(input);
}
