import type { UserPersistedType } from "@workspace/server/modules/identity/entity/user.types";

export class User {
  readonly id: UserPersistedType["id"];
  readonly name: UserPersistedType["name"];
  readonly email: UserPersistedType["email"];
  readonly passwordHash: UserPersistedType["passwordHash"];
  readonly role: UserPersistedType["role"];
  readonly createdAt: UserPersistedType["createdAt"];
  readonly updatedAt: UserPersistedType["updatedAt"];

  constructor(user: UserPersistedType) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  toObject(): UserPersistedType {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
