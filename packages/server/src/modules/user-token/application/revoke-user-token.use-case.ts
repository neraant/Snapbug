import { UserTokenMapper } from "@workspace/server/modules/user-token/entity/user-token.mapper";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  RevokeUserTokenInputDtoType,
  RevokeUserTokenOutputDtoType,
} from "@workspace/validation/modules/user-token/dto/revoke-user-token.schema";

export class RevokeUserTokenUseCase {
  constructor(private readonly userTokenRepository: UserTokenRepository) {}

  async execute(input: RevokeUserTokenInputDtoType, userId: string): Promise<RevokeUserTokenOutputDtoType> {
    const userToken = await this.userTokenRepository.findById(input.id);
    if (!userToken || userToken.userId !== userId) {
      throw new NotFoundError(ERROR_CODES.USER_TOKEN_NOT_FOUND, "Token not found");
    }

    if (userToken.revokedAt) {
      return UserTokenMapper.toDto(userToken);
    }

    const revokedUserToken = userToken.revoke(new Date());
    await this.userTokenRepository.save(revokedUserToken);
    return UserTokenMapper.toDto(revokedUserToken);
  }
}
