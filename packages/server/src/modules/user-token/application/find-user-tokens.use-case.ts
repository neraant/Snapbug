import { UserTokenMapper } from "@workspace/server/modules/user-token/entity/user-token.mapper";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import type { FindUserTokensOutputDtoType } from "@workspace/validation/modules/user-token/dto/find-user-tokens.schema";

export class FindUserTokensUseCase {
  constructor(private readonly userTokenRepository: UserTokenRepository) {}

  async execute(userId: string): Promise<FindUserTokensOutputDtoType> {
    const userTokens = await this.userTokenRepository.findManyByUserId(userId);
    return userTokens.map((userToken) => UserTokenMapper.toDto(userToken));
  }
}
