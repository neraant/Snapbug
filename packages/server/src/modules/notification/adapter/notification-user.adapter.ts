import type { UserAdapter } from "@workspace/server/modules/identity/adapter/user.adapter";
import type { NotificationUserPort } from "@workspace/server/modules/notification/port/user.port";

export class NotificationUserAdapter implements NotificationUserPort {
  constructor(private readonly userAdapter: UserAdapter) {}

  async findManyByIds(ids: string[]) {
    return await this.userAdapter.findManyByIds(ids);
  }
}
