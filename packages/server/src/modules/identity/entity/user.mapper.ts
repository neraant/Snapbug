import { User } from "@workspace/server/modules/identity/entity/user.entity";
import type { UserPersistedType } from "@workspace/server/modules/identity/entity/user.types";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export abstract class UserMapper {
  static fromPersistence(row: UserPersistedType): User {
    return new User(row);
  }

  static toPersistence(user: User): UserPersistedType {
    return user.toObject();
  }

  static toDto(user: User): UserModelType {
    const { id, name, email, interfaceLanguage, onboardingCompletedAt } = user.toObject();
    return { id, name, email, interfaceLanguage, onboardingCompletedAt };
  }

  static toFindUsersByIdsOutput(users: User[]): UserModelType[] {
    return users.map((user) => UserMapper.toDto(user));
  }

  static toCredentialsDto(user: User): UserModelType & { passwordHash: string } {
    const { id, name, email, passwordHash, interfaceLanguage, onboardingCompletedAt } = user.toObject();
    return { id, name, email, passwordHash, interfaceLanguage, onboardingCompletedAt };
  }
}
