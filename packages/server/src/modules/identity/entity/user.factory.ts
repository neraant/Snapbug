import { User } from "@workspace/server/modules/identity/entity/user.entity";
import type { CreateUserType } from "@workspace/server/modules/identity/entity/user.types";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { randomUUID } from "crypto";

export abstract class UserFactory {
  static create(user: CreateUserType): User {
    return new User({
      id: randomUUID(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
