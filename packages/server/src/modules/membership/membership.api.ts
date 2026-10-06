import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export async function createMembership(
  input: CreateMembershipInputDtoType,
  userId: string,
): Promise<CreateMembershipOutputDtoType> {
  const useCase = new CreateMembershipUseCase(new MembershipRepository());
  return await useCase.execute(input, userId);
}

export async function findMembership(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
  const useCase = new FindMembershipUseCase(new MembershipRepository());
  return await useCase.execute(input);
}

export async function findMembershipByUser(userId: string): Promise<FindMembershipByUserOutputDtoType> {
  const useCase = new FindMembershipByUserUseCase(new MembershipRepository());
  return await useCase.execute(userId);
}
