import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import type { UserTokenPersistedType } from "@workspace/server/modules/user-token/entity/user-token.types";
import { randomUUID } from "crypto";

export abstract class UserTokenFactory {
  static create(input: {
    userId: string;
    name: string;
    tokenHash: string;
    prefix: string;
    scopes: UserTokenPersistedType["scopes"];
    scopePreset: UserTokenPersistedType["scopePreset"];
    projectIds: UserTokenPersistedType["projectIds"];
  }): UserToken {
    return new UserToken({
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      name: input.name,
      prefix: input.prefix,
      scopes: input.scopes,
      scopePreset: input.scopePreset,
      projectIds: input.projectIds,
      createdAt: new Date(),
      revokedAt: null,
    });
  }
}
