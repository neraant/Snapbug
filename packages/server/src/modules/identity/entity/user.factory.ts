import { User } from "@workspace/server/modules/identity/entity/user.entity";
import type { CreateUserType } from "@workspace/server/modules/identity/entity/user.types";
import { randomUUID } from "crypto";

export abstract class UserFactory {
  static create(user: CreateUserType): User {
    return new User({
      id: randomUUID(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordChangedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
