import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export type NotificationUserPort = {
  findManyByIds(ids: string[]): Promise<UserModelType[]>;
};