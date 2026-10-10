import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export type UserPort = {
  findByEmail: (email: string) => Promise<UserModelType | null>;
};
