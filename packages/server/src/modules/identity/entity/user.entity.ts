import type { UpdateUserType, UserPersistedType } from "@workspace/server/modules/identity/entity/user.types";

export class User {
  readonly id: UserPersistedType["id"];
  readonly name: UserPersistedType["name"];
  readonly email: UserPersistedType["email"];
  readonly passwordHash: UserPersistedType["passwordHash"];
  readonly passwordChangedAt: UserPersistedType["passwordChangedAt"];
  readonly onboardingCompletedAt: UserPersistedType["onboardingCompletedAt"];
  readonly createdAt: UserPersistedType["createdAt"];
  readonly updatedAt: UserPersistedType["updatedAt"];

  constructor(user: UserPersistedType) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.passwordChangedAt = user.passwordChangedAt;
    this.onboardingCompletedAt = user.onboardingCompletedAt;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  update(patch: UpdateUserType): User {
    const passwordChanged = patch.passwordHash !== undefined && patch.passwordHash !== this.passwordHash;

    return new User({
      ...this.toObject(),
      ...patch,
      id: this.id,
      passwordChangedAt: passwordChanged ? (patch.passwordChangedAt ?? new Date()) : this.passwordChangedAt,
      onboardingCompletedAt: this.onboardingCompletedAt ?? patch.onboardingCompletedAt ?? null,
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
      onboardingCompletedAt: this.onboardingCompletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
