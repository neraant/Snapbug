import { CreateUserUseCase } from "@workspace/server/modules/identity/application/create-user.use-case";
import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { FindUserCredentialsByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-credentials-by-email.use-case";
import type {
  CreateUserOutputDtoType,
  CreateUserWithPasswordHashDtoType,
} from "@workspace/validation/modules/user/dto/create-user.schema";
import type {
  FindUserByEmailInputDtoType,
  FindUserByEmailOutputDtoType,
} from "@workspace/validation/modules/user/dto/find-user-by-email.schema";
import type {
  FindUserCredentialsByEmailInputDtoType,
  FindUserCredentialsByEmailOutputDtoType,
} from "@workspace/validation/modules/user/dto/find-user-credentials-by-email.schema";

export async function createUser(input: CreateUserWithPasswordHashDtoType): Promise<CreateUserOutputDtoType> {
  const useCase = new CreateUserUseCase();
  return await useCase.execute(input);
}

export async function findUserByEmail(input: FindUserByEmailInputDtoType): Promise<FindUserByEmailOutputDtoType> {
  const useCase = new FindUserByEmailUseCase();
  return await useCase.execute(input.email);
}

export async function findUserCredentialsByEmail(
  input: FindUserCredentialsByEmailInputDtoType,
): Promise<FindUserCredentialsByEmailOutputDtoType> {
  const useCase = new FindUserCredentialsByEmailUseCase();
  return await useCase.execute(input.email);
}
