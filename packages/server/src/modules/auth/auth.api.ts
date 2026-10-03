import { SignUpUseCase } from "@workspace/server/modules/auth/application/sign-up.use-case";
import { VerifyCredentialsUseCase } from "@workspace/server/modules/auth/application/verify-credentials.use-case";
import { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { UserAdapter } from "@workspace/server/modules/identity/adapter/user.adapter";
import type {
  VerifyCredentialsInputDtoType,
  VerifyCredentialsOutputDtoType,
} from "@workspace/validation/modules/auth/dto/verify-credentials.schema";
import type {
  CreateUserInputDtoType,
  CreateUserOutputDtoType,
} from "@workspace/validation/modules/user/dto/create-user.schema";

export async function signUp(input: CreateUserInputDtoType): Promise<CreateUserOutputDtoType> {
  const useCase = new SignUpUseCase(new AuthService(), new UserAdapter());
  return await useCase.execute(input);
}

export async function verifyCredentials(input: VerifyCredentialsInputDtoType): Promise<VerifyCredentialsOutputDtoType> {
  const useCase = new VerifyCredentialsUseCase(new AuthService(), new UserAdapter());
  return await useCase.execute(input);
}
