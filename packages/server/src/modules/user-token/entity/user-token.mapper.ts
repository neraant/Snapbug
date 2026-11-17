import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import type {
  UserTokenPersistedType,
  UserTokenRowType,
} from "@workspace/server/modules/user-token/entity/user-token.types";
import type {
  McpToolScopeType,
  UserTokenScopePresetType,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import type { CreateUserTokenOutputDtoType } from "@workspace/validation/modules/user-token/dto/create-user-token.schema";
import type { UserTokenModelType } from "@workspace/validation/modules/user-token/dto/user-token.model";

export abstract class UserTokenMapper {
  static fromPersistence(row: UserTokenRowType): UserToken {
    return new UserToken({
      ...row,
      scopes: row.scopes as McpToolScopeType[],
      scopePreset: row.scopePreset as UserTokenScopePresetType | null,
    });
  }

  static toPersistence(userToken: UserToken): UserTokenPersistedType {
    return userToken.toObject();
  }

  static toDto(userToken: UserToken): UserTokenModelType {
    const { id, name, prefix, scopes, scopePreset, projectIds, createdAt, revokedAt } = userToken.toObject();
    return {
      id,
      name,
      prefix,
      scopes,
      scopePreset,
      projectIds,
      createdAt: createdAt.toISOString(),
      revokedAt: revokedAt?.toISOString() ?? null,
    };
  }

  static toCreatedDto(userToken: UserToken, secret: string): CreateUserTokenOutputDtoType {
    const { id, name, createdAt, scopes, scopePreset, projectIds } = UserTokenMapper.toDto(userToken);
    return { id, name, createdAt, scopes, scopePreset, projectIds, secret };
  }
}
