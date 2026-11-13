import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import type { UserTokenPersistedType } from "@workspace/server/modules/user-token/entity/user-token.types";
import type { CreateUserTokenOutputDtoType } from "@workspace/validation/modules/user-token/dto/create-user-token.schema";
import type { UserTokenModelType } from "@workspace/validation/modules/user-token/dto/user-token.model";

export abstract class UserTokenMapper {
  static fromPersistence(row: UserTokenPersistedType): UserToken {
    return new UserToken(row);
  }

  static toPersistence(userToken: UserToken): UserTokenPersistedType {
    return userToken.toObject();
  }

  static toDto(userToken: UserToken): UserTokenModelType {
    const { id, prefix, createdAt, revokedAt } = userToken.toObject();
    return {
      id,
      prefix,
      createdAt: createdAt.toISOString(),
      revokedAt: revokedAt?.toISOString() ?? null,
    };
  }

  static toCreatedDto(userToken: UserToken, secret: string): CreateUserTokenOutputDtoType {
    const { id, prefix, createdAt } = UserTokenMapper.toDto(userToken);
    return { id, prefix, createdAt, secret };
  }
}
