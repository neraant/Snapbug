import type { CreateUserWithPasswordHashDtoType } from "@workspace/validation/modules/user/dto/create-user.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export type UserCredentials = UserModelType & { passwordHash: string };

export type CreateUserData = CreateUserWithPasswordHashDtoType;

export type UserPort = {
  create: (input: CreateUserData) => Promise<UserModelType>;
  findByEmail: (email: string) => Promise<UserModelType | null>;
  findCredentialsByEmail: (email: string) => Promise<UserCredentials | null>;
};
