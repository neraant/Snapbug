import type { UserPersistedType } from "@workspace/server/modules/identity/entity/user.types";

type UpdateUserType = Partial<Pick<UserPersistedType, "name" | "email" | "passwordHash" | "passwordChangedAt">>;

export class User {
  readonly id: UserPersistedType["id"];
  readonly name: UserPersistedType["name"];
  readonly email: UserPersistedType["email"];
  readonly passwordHash: UserPersistedType["passwordHash"];
  readonly passwordChangedAt: UserPersistedType["passwordChangedAt"];
  readonly createdAt: UserPersistedType["createdAt"];
  readonly updatedAt: UserPersistedType["updatedAt"];

  constructor(user: UserPersistedType) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.passwordChangedAt = user.passwordChangedAt;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  update(patch: UpdateUserType): User {
    return new User({
      ...this.toObject(),
      ...patch,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  toObject(): UserPersistedType {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      passwordChangedAt: this.passwordChangedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
