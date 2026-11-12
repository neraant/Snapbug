import { UserTokenFactory } from "@workspace/server/modules/user-token/entity/user-token.factory";
import { UserTokenMapper } from "@workspace/server/modules/user-token/entity/user-token.mapper";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import type { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import type { CreateUserTokenOutputDtoType } from "@workspace/validation/modules/user-token/dto/create-user-token.schema";

export class CreateUserTokenUseCase {
  constructor(
    private readonly userTokenService: UserTokenService,
    private readonly userTokenRepository: UserTokenRepository,
  ) {}

  async execute(userId: string): Promise<CreateUserTokenOutputDtoType> {
    const secret = this.userTokenService.createSecret();
    const userToken = UserTokenFactory.create({
      userId,
      tokenHash: this.userTokenService.hashSecret(secret),
      prefix: this.userTokenService.displayPrefix(secret),
    });

    await this.userTokenRepository.save(userToken);
    return UserTokenMapper.toCreatedDto(userToken, secret);
  }
}
