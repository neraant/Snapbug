import type { UserPort } from "@workspace/server/modules/user-token/port/user.port";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import type { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import { NotFoundError, UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindUserByTokenInputDtoType,
  FindUserByTokenOutputDtoType,
} from "@workspace/validation/modules/user-token/dto/find-user-by-token.schema";

export class FindUserByTokenUseCase {
  constructor(
    private readonly userTokenService: UserTokenService,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly userPort: UserPort,
  ) {}

  async execute(input: FindUserByTokenInputDtoType): Promise<FindUserByTokenOutputDtoType> {
    if (this.userTokenService.isProjectKey(input.token)) {
      throw new UnauthorizedError(ERROR_CODES.PROJECT_KEY_NOT_ACCEPTED, "A project key is not accepted");
    }

    const userToken = await this.userTokenRepository.findByHash(this.userTokenService.hashSecret(input.token));
    if (!userToken || userToken.revokedAt) {
      throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, "You need to sign in to continue");
    }

    try {
      return await this.userPort.findById(userToken.userId);
    } catch (error) {
      if (error instanceof NotFoundError && error.errorCode === ERROR_CODES.USER_NOT_FOUND) {
        throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, "You need to sign in to continue");
      }
      throw error;
    }
  }
}
