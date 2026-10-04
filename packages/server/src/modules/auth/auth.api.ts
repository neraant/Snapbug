import { RequestPasswordResetUseCase } from "@workspace/server/modules/auth/application/request-password-reset.use-case";
import { ResetPasswordUseCase } from "@workspace/server/modules/auth/application/reset-password.use-case";
import { SignUpUseCase } from "@workspace/server/modules/auth/application/sign-up.use-case";
import { VerifyCredentialsUseCase } from "@workspace/server/modules/auth/application/verify-credentials.use-case";
import { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { UserAdapter } from "@workspace/server/modules/identity/adapter/user.adapter";
import { withTransaction } from "@workspace/server/shared/database/transaction.util";
import { resendClient } from "@workspace/server/shared/email/email.client";
import { EmailService } from "@workspace/server/shared/email/service/email.service";
import type {
  RequestResetPasswordInputDtoType,
  RequestResetPasswordOutputDtoType,
} from "@workspace/validation/modules/auth/dto/request-reset-password.schema";
import type {
  ResetPasswordInputDtoType,
  ResetPasswordOutputDtoType,
} from "@workspace/validation/modules/auth/dto/reset-password.schema";
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

export async function requestResetPassword(
  input: RequestResetPasswordInputDtoType,
): Promise<RequestResetPasswordOutputDtoType> {
  const useCase = new RequestPasswordResetUseCase(
    new ResetPasswordRepository(),
    new UserAdapter(),
    new AuthService(),
    new EmailService(resendClient),
    withTransaction,
  );
  return await useCase.execute(input);
}

export async function resetPassword(input: ResetPasswordInputDtoType): Promise<ResetPasswordOutputDtoType> {
  const useCase = new ResetPasswordUseCase(new ResetPasswordRepository(), new UserAdapter(), new AuthService());
  return await useCase.execute(input);
}
