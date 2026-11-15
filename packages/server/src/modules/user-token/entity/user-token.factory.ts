import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import { randomUUID } from "crypto";

export abstract class UserTokenFactory {
  static create(input: { userId: string; name: string; tokenHash: string; prefix: string }): UserToken {
    return new UserToken({
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      name: input.name,
      prefix: input.prefix,
      createdAt: new Date(),
      revokedAt: null,
    });
  }
}
