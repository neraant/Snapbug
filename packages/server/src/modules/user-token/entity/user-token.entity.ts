import type { UserTokenPersistedType } from "@workspace/server/modules/user-token/entity/user-token.types";

export class UserToken {
  readonly id: UserTokenPersistedType["id"];
  readonly userId: UserTokenPersistedType["userId"];
  readonly tokenHash: UserTokenPersistedType["tokenHash"];
  readonly prefix: UserTokenPersistedType["prefix"];
  readonly createdAt: UserTokenPersistedType["createdAt"];
  readonly revokedAt: UserTokenPersistedType["revokedAt"];

  constructor(userToken: UserTokenPersistedType) {
    this.id = userToken.id;
    this.userId = userToken.userId;
    this.tokenHash = userToken.tokenHash;
    this.prefix = userToken.prefix;
    this.createdAt = userToken.createdAt;
    this.revokedAt = userToken.revokedAt;
  }

  revoke(revokedAt: Date): UserToken {
    return new UserToken({ ...this.toObject(), revokedAt });
  }

  toObject(): UserTokenPersistedType {
    return {
      id: this.id,
      userId: this.userId,
      tokenHash: this.tokenHash,
      prefix: this.prefix,
      createdAt: this.createdAt,
      revokedAt: this.revokedAt,
    };
  }
}
